const User = require("../models/User");
const Tweet = require("../models/Tweet");

// Get home page
exports.getHomePage = (req, res) => {
  user = req.session.userId;
  if (user) {
    res.redirect("/feed");
  } else {
    res.render("index");
  }
}

// Get register page
exports.getRegisterPage = (req, res) => {
  res.render("register");
}

// Get feed page
exports.getFeedPage = async (req, res) => {
  try {
    // Get the user
    const user = await User.findById(req.session.userId).populate("following");; 
    // Gets a list of user and his followings
    let allTweetsFrom = [...user.following];
    allTweetsFrom.push(user._id);
    // Get tweets from user and its followings
    const recents = await Tweet.find({ author: { $in: allTweetsFrom } }).sort({ date: -1 });
    // Get tweets from all users
    const everyones = await Tweet.find({}).limit(10).sort({ date: -1 });   
    // Feed page with needed values
    res.status(200).render("feed", {
      user,
      recents,
      everyones,
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
};

// Get user profile page
exports.getProfilePage = async (req, res) => {
  try {
    // Get the user
    const user = await User.findById(req.session.userId);
    // Redirect to user profile page
    res.redirect(`/users/${user.user}`);

  } catch (err) {
    // Go to home page if error
    req.flash("error", "Request failed.");
    res.status(400).redirect("/");
  }
};

// FIXME: This is not working ///////////////////////////////////////////////////////////////
exports.getSearch = async (req, res) => {
  try {
    // Get the search term
    const term = req.body.term;
    // Get the user
    const user = await User.findById(req.session.userId);
    // Search for the term in the users and tweets
    let tweets = await Tweet.find({ tweet: { $regex: ".*" + term + ".*", $options: "i" } }).sort({ date: -1 });
    let users = await User.find({ user: { $regex: ".*" + term + ".*", $options: "i" } });
    // Render the search page
    res.render("list", {
      user,
      tweets,
      users,
    });

  } catch (err) {
    // Go to home page if error
    req.flash("error", "Search failed");
    res.redirect("/");
  }
};