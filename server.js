const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");
let currentUser = "61279de16402a340b87907d0";

mongoose.connect('mongodb://localhost:27017/oldTwitterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

app.get("/", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/error", function(req, res) {
  res.render("error");
});

app.get("/feed", function(req, res) {
  User.findOne({
    _id: currentUser
  }, function(err, foundUser) {
    if (!err) {
      let tweets = [];
      Tweet.find({
        author: currentUser
      }, function(err, foundTweets) {

        if(foundTweets.length !==0){

          Tweet.find({
            _id: foundUser.updates[foundUser.updates.length-1],
          }, function(err, tweet) {

            res.render("feed", {
              user: foundUser,
              tweets: foundTweets,
              lastTweet: tweet,
            });

          })

        } else {
          res.render("feed", {
            user: foundUser,
            tweets: foundTweets,
            lastTweet: {text: "not updated yet"}
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
    user: "admin"
  }, function(err, foundUser) {

    if (!err) {

      let tweets = [];
      Tweet.find({
        author: currentUser
      }, function(err, foundTweets) {
        res.render("profile", {
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
          user: foundUser,
          tweets: foundTweets,
        });
      });

    } else {
      res.redirect("error");
    }

  });
});





app.post("/", function(req, res) {
  const loginName = req.body.loginName;
  const loginPw = req.body.loginPassword;

  User.findOne({
    user: loginName,
    password: loginPw
  }, function(err, foundUser) {
    if (!foundUser) {
      res.redirect("error");
    } else {
      currentUser = foundUser._id;
      res.redirect("feed");
    }
  });

});

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

  let newId;
  User.findOne({
    _id: userID
  }, function(err, found) {
    const newTweet = new Tweet({
      author: userID,
      text: tweet,
      likes: [],
      date: date,
      img: found.image,
      tweeter: found.user,
    });
    newId = newTweet._id;
    newTweet.save();
  });

  User.findOne({
    _id: userID
  }, function(err, foundUser) {
    foundUser.updates.push(newId);
    foundUser.save();
  });

  res.redirect("feed");
});

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
      currentUser = newUser._id;
    } else {
      res.redirect("error");
    }
  });

});




app.listen(process.env.PORT || 3000, function() {
  console.log("Old Twitter Server is on at Port: 3000");
});
