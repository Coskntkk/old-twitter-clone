const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require('ejs');

app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/", function(req, res) {
  var loginID = req.body.loginName;
  var loginPw = req.body.loginPassword;
  var rememberCheck = req.body.loginRemember;
  var remember = false;
  if (rememberCheck == "true") {
    remember = true;
  } else {
    remember = false;
  }

  var admin = {
    name: "coskntkk",
    password: "supersecret",
    email: "coskntkk@gmail.com"
  };


  var data = {
    login: [{
      name: loginID,
      password: loginPw,
      rememberLogin: remember
    }]
  };
  console.log(data);

  if (loginID == admin["name"] && loginPw == admin["password"]) {
    res.sendFile(__dirname + "/home.html");
  } else {
    res.sendFile((__dirname + "/login.html"));
  };

});

app.get("/account", function(req, res) {
  res.sendFile(__dirname + "/account.html");
});

app.post("/account", function(req, res) {
  var userName = req.body.userName;
  var userPassword = req.body.userPassword;
  var userEmail = req.body.userEmail;
  var checkbox = req.body.userScoop;
  var subscription = false;
  if (checkbox == "true") {
    subscription = true;
  } else {
    subscription = false;
  }

  var success;

  if ((userName.includes(" ")) || (userPassword.includes(" ") || userPassword.length < 6)) {
    success = false;
  }

  var data = {
    members: [{
      name: userName,
      password: userPassword,
      email: userEmail,
      subscribed: subscription,
    }]
  };

  console.log(data);
  res.sendFile(__dirname + "/login.html");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Old Twitter Server is on at Port: 3000");
});
