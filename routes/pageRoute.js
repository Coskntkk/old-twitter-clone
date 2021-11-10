// Import modules
const express = require("express");
const pageController = require("../controllers/pageController");

// Create router
const router = express.Router();

// .../

// Get home page
router.route("/").get(pageController.getHomePage);

// Get register page
router.route("/register").get(pageController.getRegisterPage);

// Get feed page
router.route("/feed").get(pageController.getFeedPage);

// Get profile page
router.route("/profile").get(pageController.getProfilePage);

// Get search page
router.route("/search").post(pageController.getSearch);


// Export router
module.exports = router;