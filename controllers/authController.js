const User = require("../models/User");
const Tweet = require("../models/Tweet");
const bcrypt = require("bcrypt");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Create a new user
    const newUser = new User({
      user: req.body.user,
      nick: req.body.user,
      email: req.body.email,
      password: req.body.password,
      image: `${Math.ceil(Math.random()*5)+1}.png`,
      lastTweet: "Not updated yet",
    });
    await newUser.save();
    // Redirect to login page
    req.flash("success", "Account created successfully");
    res.status(201).redirect("/");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Account creation failed");
    res.status(400).redirect("back");

  }
};

// Login to a user
exports.loginUser = async (req, res) => {
  try {
    // Find user by email
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (user) {
      // Check if password is correct
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          // Redirect to home page if password is correct
          req.session.userId = user._id;
          res.redirect("/feed");
        } else {
          // Redirect to login page if password is incorrect
          req.flash("error", "Invalid password");
          res.redirect("back");
        }
      });
    } else {
      // Redirect to login page if user doesn't exist
      req.flash("error", "Account not found");
      res.redirect("back");
    }

  } catch (err) {
    // Redirect to login page if error occurs
    req.flash("error", "Login failed");
    res.status(400).redirect("error");
  }
}

// Go to a user's profile
exports.getUser = async (req, res) => {
  try {
    // Get session user
    const sessionUser = await User.findById(req.session.userId);
    // Get target user and its tweets
    const user = await User.findOne({user: req.params.user});
    const tweets = await Tweet.find({ author: user._id });
    // Render user profile
    res.status(200).render("profile", {
      sessionUser,
      user,
      tweets,
    });

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "User not found");
    res.status(400).redirect("back");

  }
}

// Logout a user
exports.logoutUser = (req, res) => {
  // Destroy session
  req.session.destroy();
  // Redirect to home page
  res.redirect("/");
}

// Follow a user
exports.followUser = async (req, res) => {
  try {
    // Get follower and followed persons
    const toFollow = await User.findOne({ user: req.params.user });
    const user = await User.findById(req.session.userId);
    // Add followed person's id to follower's following lists
    await user.following.push(toFollow._id);
    // Add followed person's image link to follower's image list
    await user.followingImages.push(toFollow.image);
    // Add follower's id to followed person's followers list
    await toFollow.followers.push(user._id);
    // Save changes
    await user.save();
    await toFollow.save();
    // Redirect to same page
    req.flash("success", "Followed successfully");
    res.redirect("back");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Following failed;" + err.message);
    res.status(400).redirect("back");
  }
}

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    // Get follower and followed persons
    const toUnfollow = await User.findOne({ user: req.params.user });
    const user = await User.findById(req.session.userId);
    // Remove followed person's id from follower's following lists
    await user.following.pull(toUnfollow._id);
    // Remove followed person's image link from follower's image list
    await user.followingImages.pull(toUnfollow.image);
    // Remove follower's id from followed person's followers list
    await toUnfollow.followers.pull(user._id);
    // Save changes
    await user.save();
    await toUnfollow.save();
    // Redirect to same page
    req.flash("success", "Unfollowed successfully");
    res.redirect("back");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Unfollowing failed.");
    res.status(400).redirect("back");
  }
}

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    // Get session user
    const user = await User.findById(req.session.userId);
    // Get target user
    const targetUser = await User.findOne({ user: req.params.user });
    // Get followers of target user
    const followers = await User.find({ _id: {
      $in: targetUser.followers
    }});
    // Render list page
    res.render("list", {
      user,
      tweets: [],
      users: followers,
    });

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Search failed.");
    res.status(400).redirect("back");
  }
}

// Get followings of a user
exports.getFollowings = async (req, res) => {
  try {
    // Get session user
    const user = await User.findById(req.session.userId);
    // Get target user
    const targetUser = await User.findOne({ user: req.params.user });
    // Get followings of target user
    const followings = await User.find({ _id: {
      $in: targetUser.following
    }});
    // Render list page
    res.render("list", {
      user,
      tweets: [],
      users: followings,
    });

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Search failed.");
    res.status(400).redirect("back");
  }
}


// Get favorites of a user
exports.getFavorites = async (req, res) => {
  try {
    // Get session user
    const user = await User.findById(req.session.userId);
    // Get target user
    const targetUser = await User.findOne({ user: req.params.user });
    // Get favorites of target user
    const favorites = await Tweet.find({ _id: {
      $in: targetUser.favorites
    }});
    // Render list page
    res.render("list", {
      user,
      tweets: favorites,
      users: [],
    });

  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Search failed.");
    res.status(400).redirect("back");
  }
}

// Get updates of a user
exports.getUpdates = async (req, res) => {
  try {
    // Get session user
    const user = await User.findById(req.session.userId);
    // Get target user
    const targetUser = await User.findOne({ user: req.params.user });
    // Get updates of target user
    const updates = await Tweet.find({ _id: {
      $in: targetUser.updates
    }});
    // Render list page
    res.render("list", {
      user,
      tweets: updates,
      users: [],
    });
    
  } catch (err) {
    // Go back if error occurs
    req.flash("error", "Search failed.");
    res.status(400).redirect("back");
  }
}