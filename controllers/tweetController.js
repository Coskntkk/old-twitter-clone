const User = require("../models/User");
const Tweet = require("../models/Tweet");

// Post a new tweet
exports.createTweet = async (req, res) => {
  try {
    // Get user and create tweet
    const user = await User.findById(req.session.userId);
    const tweet = await Tweet.create({
      tweeter: user.user,
      author: user._id,
      tweet: req.body.tweet,
      img: user.image
    });
    // Add tweet to user's updates
    await user.updates.push(tweet._id);
    await user.save();
    // Redirect to the same page
    req.flash("success", "Tweet posted.");
    res.status(201).redirect("back");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", err);
    res.status(400).redirect("back");
  }
};

// Get tweet by id
exports.getTweet = async (req, res) => {
  try {
    // Get user and find tweet
    const user = await User.findById(req.session.userId);
    const tweet = await Tweet.findById(req.params.id);
    // Get parent and child tweets if they exists
    const parent = tweet.parent ? await Tweet.findById(tweet.parent) : null;
    const children = await Tweet.find({ parent: tweet._id });
    // Render tweet page
    res.status(200).render("tweet", {
      user,
      tweet,
      parent,
      children,
    });

  } catch (err) {
    // Go back if error occurs
    req.flash("error", err.message);
    res.status(400).redirect("/feed");
  }
};

// FIXME: This is not working
exports.favTweet = async (req, res) => {
  try {
    // Get tweet and user
    const tweet = await Tweet.findById(req.params.id);
    const user = await User.findById(req.session.userId);
    // Adds user's id to tweet's liked list
    tweet.likes.push(user._id);
    await tweet.save();
    // Adds tweet's id to user's favorites list
    user.favorites.push(tweet._id);
    await user.save();
    // Redirects to the same page.
    res.redirect("/tweets/"+ req.params.id);

  } catch (err) {
    // Go back if error occurs
    req.flash("error", err.message);
    res.redirect("back");
  }
};

// FIXME: This is not working
exports.unfavTweet = async (req, res) => {
  try {
    // Get tweet and user
    const tweet = await Tweet.findById(req.params.id);
    const user = await User.findById(req.session.userId);
    // Removes user's id from tweet's likes
    tweet.likes.pull(user._id);
    await tweet.save();
    // Removes tweet's id from user's favorites
    user.favorites.pull(tweet._id);
    await user.save();
    // Redirects to the same page
    res.redirect("/tweets/"+ req.params.id);
  } catch (err) {
    // Go back if error occurs
    req.flash("error", err.message);
    res.redirect("back");
  }
};

// Reply to a tweet
exports.replyTweet = async (req, res) => {
  try {
    // Get parent if it exists
    const parent = req.params.id;
    // Get user and create tweet
    const user = await User.findById(req.session.userId);
    const tweet = await Tweet.create({
      tweeter: user.user,
      author: user._id,
      tweet: req.body.tweet,
      img: user.image,
      parent: parent
    });
    // Add tweet to user's updates
    await user.updates.push(tweet._id);
    await user.save();
    // Redirect to the same page
    req.flash("success", "Reply posted.");
    res.status(201).redirect("back");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", err);
    res.status(400).redirect("back");
  }
};

// Delete tweet by id
exports.deleteTweet = async (req, res) => {
  try {
    // Get tweet and user
    const tweet = await Tweet.findById(req.params.id);
    const user = await User.findById(req.session.userId);
    // Remove tweet from user's updates
    await user.updates.pull(tweet._id);
    await user.save();
    // Remove tweet from users' favorites
    await User.updateMany({favorites: {$in: [tweet._id]}}, {$pull: {favorites: {$in: [tweet._id]}}});
    // Delete tweet
    await Tweet.findByIdAndDelete(req.params.id);
    // Redirect to the same page
    req.flash("success", "Tweet deleted.");
    res.redirect("/feed");

  } catch (err) {
    // Go back if error occurs
    req.flash("error", err.message);
    res.status(400).redirect("back");
  }
};
