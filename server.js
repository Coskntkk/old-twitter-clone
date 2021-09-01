const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/oldTwitterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const tweetSchema = {
  tweeter: String,
  author: String,
  text: String,
  likes: [String],
  date: String,
  img: String,
}

const userSchema = {
  user: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  nick: String,
  image: String,
  following: [String],
  followers: [String],
  updates: [String],
  favorites: [String],
}

const Tweet = mongoose.model("Tweet", tweetSchema);
const User = mongoose.model("User", userSchema);

app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

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

app.get("/", function(req, res) {
  foundUser = null;
  res.render("login", {
    currentUser: currentUser
  });
});

app.get("/register", function(req, res) {
  res.render("register", {
    currentUser: currentUser
  });
});

app.get("/error", function(req, res) {
  res.render("error", {
    currentUser: currentUser
  });
});

app.get("/feed", function(req, res) {
  User.findOne({
    user: currentUser.user
  }, function(err, foundUser) {
    if (!err) {
      let tweets = [];
      Tweet.find({
        author: foundUser._id
      }, function(err, foundTweets) {

        let allPosts;
        Tweet.find({}, ).limit(10).exec(function(err, posts) {
          allPosts = posts;
        });

        if (foundTweets.length !== 0) {

          Tweet.find({
            _id: foundUser.updates[foundUser.updates.length - 1],
          }, function(err, tweet) {

            res.render("feed", {
              currentUser: currentUser,
              user: foundUser,
              tweets: foundTweets,
              lastTweet: tweet,
              allPosts: allPosts,
            });

          });

        } else {
          res.render("feed", {
            currentUser: currentUser,
            user: foundUser,
            tweets: foundTweets,
            lastTweet: [{
              text: "not updated yet"
            }],
            allPosts: allPosts,
          });
        }

      });
    } else {
      res.redirect("error");
    }
  });
});


app.get("/profile", function(req, res) {

  User.findOne({
    user: currentUser.user
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

  /*
 
  */

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
  res.redirect("/feed");
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
  res.redirect("/feed");
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

  res.redirect("/feed");
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

  res.redirect("/feed");
});





app.listen(process.env.PORT || 3000, function() {
  console.log("Old Twitter Server is on at Port: 3000");
});
