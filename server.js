const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function ( req, res ){
  res.sendFile(__dirname + "/login.html");
});

app.get("/account", function ( req, res ){
  res.sendFile(__dirname + "/account.html");
});

app.post("/account", function(req, res) {
  const userName = req.body.userName;
  const userPassword = req.body.userPassword;
  const userEmail = req.body.userEmail;
  const checkbox = req.body.userScoop;
  var subscription = false;

  if (checkbox == "true") {
    subscription = true;
  } else {
    subscription = false;
  }

  const data = {
    members: [
      {
        name: userName,
        password: userPassword,
        email: userEmail,
        subscribed: subscription,
      }
    ]
  };

  console.log(data);
  res.sendFile(__dirname + "/login.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Old Twitter Server is on at Port: 3000");
});
