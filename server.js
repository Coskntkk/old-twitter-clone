const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const dbUrl = require("./dbUrl");

// Mongoose Configuration
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log("DB Connected.");
});

// Routers
const pageRoute = require("./routes/pageRoute");
const userRoute = require("./routes/userRoute");
const tweetRoute = require("./routes/tweetRoute");

// Express & EJS Configuration
app = express();
app.set('view engine', 'ejs');

// Global Variables
global.userIN = null;

// Middlewares
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "old twitter",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: dbUrl }),
}));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash("");
  next();
});

// Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userId;
  next();
});
app.use("/", pageRoute);
app.use("/users", userRoute);
app.use("/tweets", tweetRoute)

// Server Configuration
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Old Twitter Server is on at Port: 3000");
});
