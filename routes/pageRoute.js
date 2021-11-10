// Import modules
const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// Create router
const router = express.Router();

// .../

// Get home page
router.route("/").get(redirectMiddleware, pageController.getHomePage);

// Get register page
router.route("/register").get(redirectMiddleware, pageController.getRegisterPage);

// Get feed page
router.route("/feed").get(authMiddleware, pageController.getFeedPage);

// Get profile page
router.route("/profile").get(authMiddleware, pageController.getProfilePage);

// Get search page
router.route("/search").post(authMiddleware, pageController.getSearch);


// Export router
module.exports = router;