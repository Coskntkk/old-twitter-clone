const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Mongoose Configuration
mongoose.connect('mongodb://localhost:27017/oldTwitterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Document Schemas
const tweetSchema = {
  tweeter: String, // Display name of author
  author: String, // ID of author
  text: String, // Content of tweet
  likes: [String], // ID's of liked accounts
  date: String, // Date
  img: String, // Profile image of author
}
const userSchema = {
  user: {
    type: String,
    required: true,
    unique: true
  }, // Unique name of account
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  }, // Email
  password: {
    type: String,
    required: true,
  }, // Password
  nick: String, // Display name
  image: String, // Profile image url
  following: [String], // List of following accounts
  followers: [String], // List of follower accounts
  updates: [String], // List of tweet id's
  favorites: [String], // List of liked tweets's ids
  lastTweet: String, // Text of last update
  followingImages: [String], // List of following accounts profile images
}
const Tweet = mongoose.model("Tweet", tweetSchema);
const User = mongoose.model("User", userSchema);

// Express & EJS Configuration
app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// User account
let currentUser;
///*
User.findOne({
  user: "adm"
}, function(err, foundUser) {
  if (!err) {
    currentUser = foundUser;
  }
});
//*/

// Main page to log in
app.get("/", function(req, res) {
  foundUser = null;
  res.render("login", {
    currentUser: currentUser
  });
});

// Register page for account creation
app.get("/register", function(req, res) {
  res.render("register", {
    currentUser: currentUser
  });
});

// Error page if something wents wrong
app.get("/error", function(req, res) {
  res.render("error", {
    currentUser: currentUser
  });
});

// FEED/HOME PAGE
app.get("/feed", function(req, res) {

  if (!currentUser) {

    // Returns to the main page if did not log in
    res.redirect("/");
  } else {

    // Updates the current user
    User.findOne({
      _id: currentUser._id
    }, function(err, user) {
      currentUser = user;

      // Gets a list of user and his followings
      let allTweetsFrom = [...currentUser.following];
      allTweetsFrom.push(currentUser._id.toString());

      // Variables for feed page tabs
      let recents;
      let everyones;
      let lastTweet;

      // Gets's user's last tweet
      let lastTweetID = currentUser.updates[currentUser.updates.length - 1];
      Tweet.findOne({
        _id: lastTweetID
      }, function(err, foundTweet) {
        if (foundTweet) {
          lastTweet = foundTweet;
        } else {
          lastTweet = {
            // If no last tweet
            text: "Not updated yet."
          };
        }

        // Gets user and followings tweets to show in the recents tab
        Tweet.find({
          author: {
            $in: allTweetsFrom
          }
        }, function(err, foundTweets) {
          if (!err) {
            recents = foundTweets;
          }

          // Gets 10 last tweets of all to show in the everyone tab
          Tweet.find({}, ).limit(10).exec(function(err, posts) {
            if (!err) {
              everyones = posts;
            }

            let followedOnes = [...currentUser.following];
            User.find({_id: { $in: followedOnes}}, function(err, foundPeople){
              let imagelist = [];
              foundPeople.forEach(function(foundPerson){
                imagelist.push(foundPerson.image);
              });

              // Feed page with needed values
              res.render("feed", {
                currentUser: currentUser,
                recents: recents,
                everyones: everyones,
                lastTweet: lastTweet,
                images: imagelist,
              });
            })
          });
        });
      });
    });
  }
});


app.get("/profile", function(req, res) {

  // Updates the current user
  User.findOne({
    _id: currentUser._id
  }, function(err, foundUser) {
    currentUser = foundUser;

    if (!err) {

      let tweets = [];
      Tweet.find({
        author: foundUser._id
      }, function(err, foundTweets) {
        res.render("profile", {
          currentUser: currentUser,
          user: foundUser,
          tweets: foundTweets,
        });
      });

    } else {
      res.redirect("error");
    }

  });
});

app.get("/user/:user", function(req, res) {
  const userName = req.params.user.toLowerCase();

  User.findOne({
    user: userName
  }, function(err, foundUser) {

    if (!err) {

      let tweets = [];

      Tweet.find({
        author: foundUser._id
      }, function(err, foundTweets) {
        res.render("profile", {
          currentUser: currentUser,
          user: foundUser,
          tweets: foundTweets,
        });
      });

    } else {
      res.redirect("error");
    }

  });
});




// Post for creating account
app.post("/register", function(req, res) {
  const userName = req.body.userName;
  const userPassword = req.body.userPassword;
  const userEmail = req.body.userEmail;

  const newUser = new User({
    user: userName.toLowerCase(),
    email: userEmail,
    password: userPassword,
    nick: userName,
    image: `${Math.ceil(Math.random()*5)+1}.png`,
    following: [],
    followers: [],
    updates: [],
    lastTweet: "Not updated yet",
    followingImages: []
  });

  newUser.save(function(err) {
    if (!err) {
      res.redirect("feed");
      currentUser = newUser;
    } else {
      res.redirect("error");
    }
  });

});

// Post for logging in
app.post("/login", function(req, res) {
  const loginName = req.body.loginName;
  const loginPw = req.body.loginPassword;

  User.findOne({
    user: loginName,
    password: loginPw
  }, function(err, foundUser) {
    if (!foundUser) {
      res.redirect("error");
    } else {
      currentUser = foundUser;
      res.redirect("feed");
    }
  });

});

// Post for logging out
app.post("/logout", function(req, res) {
  currentUser = null;
  res.redirect("/");
});

// Post for tweeting
app.post("/tweet", function(req, res) {
  const userID = req.body.userID;
  const tweet = req.body.tweetText;
  const rawdate = new Date();
  const date = rawdate.toLocaleString("tr-TR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  User.findOne({
    _id: userID
  }, function(err, found) {
    if (!err) {
      const newTweet = new Tweet({
        author: userID,
        text: tweet,
        likes: [],
        date: date,
        img: found.image,
        tweeter: found.user,
      });
      let newID = newTweet._id;
      newTweet.save();

      User.findOne({
        _id: userID
      }, function(err, foundUser) {
        foundUser.updates.push(newID);
        foundUser.save();
      });
    };
  });

  User.updateOne({_id: userID}, { $set: { lastTweet: tweet}}, function(err, user){});

  res.redirect("feed");
});

// Post for deleting a tweet
app.post("/delete", function(req, res) {
  // This post method gets tweet and author ids
  let tweetID = req.body.tweetID;
  let authorID = req.body.authorID;
  let page = req.body.page;

  // Delete from author's updates list
  User.updateOne({
    _id: authorID
  }, {
    $pull: {
      updates: {
        $eq: tweetID
      }
    }
  }, function(err, foundUser) {
    if (!err) {}
  });

  // Deletes tweet from liked people's liked lists
  User.updateMany({
    favorites: {
      $in: [tweetID]
    }
  }, {
    $pull: {
      favorites: {
        $eq: tweetID
      }
    }
  }, function(err, foundUser) {
    if (!err) {}
  });

  // Deletes tweet from database
  Tweet.deleteOne({
    _id: tweetID
  }, function(err) {
    if (!err) {}
  });

  // Redirects to the same page.
  if (page === "feed") {
    res.redirect("feed");
  } else if (page === "profile") {
    res.redirect("profile");
  } else {
    res.redirect("error");
  }
});

// Post for favoriting a tweet
app.post("/fav", function(req, res) {
  // This post method gets tweet and author ids and...
  let tweetID = req.body.tweetID;
  let userID = req.body.userID;

  // Adds user's id to tweet's liked list
  Tweet.updateOne({
    _id: tweetID
  }, {
    $push: {
      likes: userID
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  // Adds tweet's id to user's favorites list
  User.updateOne({
    _id: userID
  }, {
    $push: {
      favorites: tweetID
    }
  }, function(err, foundUser) {
    if (!err) {}
  });

  // Redirects to the same page.
  res.redirect("back");
});

// Post for removing a favorite
app.post("/unfav", function(req, res) {
  // This post method gets tweet and author ids and...
  let tweetID = req.body.tweetID;
  let userID = req.body.userID;

  // Removes user's id from tweet's favorites
  Tweet.updateOne({
    _id: tweetID
  }, {
    $pull: {
      likes: {
        $eq: userID
      }
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  // Removes tweet's id from user's favorites
  User.updateOne({
    _id: userID
  }, {
    $pull: {
      favorites: {
        $eq: tweetID
      }
    }
  }, function(err, foundUser) {
    if (!err) {}
  });

  // Redirects to the same page.
  res.redirect("back");
});

// Post for following an account
app.post("/follow", function(req, res) {
  let followerID = req.body.followerID;
  let accountID = req.body.accountID;

  // Adds followed person's id to follower's following lists
  User.updateOne({
    _id: followerID
  }, {
    $push: {
      following: accountID
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  // Adds follower's id to followed person's followers list
  User.updateOne({
    _id: accountID
  }, {
    $push: {
      followers: followerID
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  // Adds followed person's image link to follower's follows list
  User.findOne({_id: accountID}, function(err, foundPerson){
    let img = foundPerson.image;
    User.updateOne({_id: followerID}, { $push: { followingImages: img}}, function(err){});
  });

  res.redirect("back");
});

// Post for unfollowing an account
app.post("/unfollow", function(req, res) {
  let followerID = req.body.followerID;
  let accountID = req.body.accountID;

  // Removes followed person's id to follower's following lists
  User.updateOne({
    _id: followerID
  }, {
    $pull: {
      following: {
        $eq: accountID
      }
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  // Removes follower's id to followed person's followers list
  User.updateOne({
    _id: accountID
  }, {
    $pull: {
      followers: {
        $eq: followerID
      }
    }
  }, function(err, foundTweet) {
    if (!err) {}
  });

  res.redirect("back");
});

app.post("/search", function(req, res) {
  const searchWord = req.body.searchWord.toLowerCase();

  let tweets;
  let users;

  User.findOne({
    _id: currentUser._id
  }, function(err, foundUser) {
    currentUser = foundUser;

    User.find({
      user: {
        $regex: searchWord.toLowerCase(),
        $options: "i"
      }
    }, function(err, foundUsers) {
      users = foundUsers;

      Tweet.find({
        text: {
          $regex: searchWord.toLowerCase(),
          $options: "i"
        }
      }, function(err, foundTweets) {
        tweets = foundTweets;

        res.render("list", {
          currentUser: currentUser,
          tweets: tweets,
          users: users,
        });
      });
    });
  });

  //res.redirect("back");
});

// Post to list someone's followers
app.post("/followings", function(req, res) {
  let userID = req.body.userID;

  User.findOne({
    _id: userID
  }, function(err, foundUser) {

    if (err || !foundUser) {
      res.redirect("error")
    } else {

      userFollows = [...foundUser.following];

      User.find({
        _id: {
          $in: userFollows
        }
      }, function(err, foundUsers) {
        if (!err && foundUsers.length > 0) {

          users = foundUsers;

          res.render("list", {
            currentUser: currentUser,
            tweets: [],
            users: users,
          });
        }
      });
    }
  });
});

// Post to list someone's followers
app.post("/followers", function(req, res) {
  let userID = req.body.userID;

  User.findOne({
    _id: userID
  }, function(err, foundUser) {

    if (err || !foundUser) {
      res.redirect("error")
    } else {

      userFollows = [...foundUser.followers];

      User.find({
        _id: {
          $in: userFollows
        }
      }, function(err, foundUsers) {
        if (!err && foundUsers.length > 0) {

          users = foundUsers;

          res.render("list", {
            currentUser: currentUser,
            tweets: [],
            users: users,
          });
        }
      });
    }
  });
});

// Post to list someone's favorites
app.post("/favorites", function(req, res) {
  let userID = req.body.userID;

  User.findOne({
    _id: userID
  }, function(err, foundUser) {

    if (err || !foundUser) {
      res.redirect("error")
    } else {

      userFavorites = [...foundUser.favorites];

      Tweet.find({
        _id: {
          $in: userFavorites
        }
      }, function(err, foundTweets) {
        if (!err && foundTweets.length > 0) {

          tweets = foundTweets;

          res.render("list", {
            currentUser: currentUser,
            tweets: tweets,
            users: [],
          });
        }
      });
    }
  });
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Old Twitter Server is on at Port: 3000");
});
