// Import modules
const express = require("express");
const tweetController = require("../controllers/tweetController");

// Create router
const router = express.Router();

// .../tweets

// Create a new tweet
router.route("/").post(tweetController.createTweet);

// Get a tweet by id
router.route("/:id").get(tweetController.getTweet);

// Favorite a tweet
router.route("/:id/fav").get(tweetController.favTweet);

// Unfavorite a tweet
router.route("/:id/unfav").get(tweetController.unfavTweet);

// Reply to a tweet
router.route("/:id/reply").post(tweetController.replyTweet);

// Delete a tweet
router.route("/:id/delete").get(tweetController.deleteTweet);


// Export router
module.exports = router;