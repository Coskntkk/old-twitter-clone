// Import core modules
require('dotenv').config()
const express = require("express");

// Express & EJS Configuration
app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes // All routes will be redirected to the https://old-twitter.vercel.app/ address
app.use("/", async (req, res, next) => {
  res.redirect(301, "https://old-twitter.vercel.app");
});

// Server Configuration
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Old Twitter Server is on at Port: ${port}`);
});
