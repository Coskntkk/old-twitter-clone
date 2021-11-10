// Import modules
const express = require("express");
const authController = require("../controllers/authController");

// Create router
const router = express.Router();


// .../users

// Create a new user
router.route("/register").post(authController.createUser);

// Login to a user
router.route("/login").post(authController.loginUser);


// Logout a user
router.route("/logout").get(authController.logoutUser);

// Get a user
router.route("/:user").get(authController.getUser);

// Follow a user
router.route("/:user/follow").get(authController.followUser);

// Unfollow a user
router.route("/:user/unfollow").get(authController.unfollowUser);


// Get followings of a user
router.route("/:user/followings").get(authController.getFollowings);

// Get followers of a user
router.route("/:user/followers").get(authController.getFollowers);

// Get favorites of a user
router.route("/:user/favorites").get(authController.getFavorites);

// Get updates of a user
router.route("/:user/updates").get(authController.getUpdates);


// Export router
module.exports = router;