// Import modules
const express = require("express");
const authController = require("../controllers/authController");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");

// Create router
const router = express.Router();


// .../users

// .../users/register
router.route("/register")
    // Create a new user
    .post(
        [
            // Validate the user name
            body('user').not().isEmpty().withMessage(' Username is required')
            .custom((userName) => {
                return User.findOne({ nick: userName }).then(user => {
                    if (user) {
                        return Promise.reject(' Username already exists');
                    }
                });
            }),
            // Validate the user email
            body('email').not().isEmpty().withMessage(' Email is required')
            .custom((userEmail) => {
                return User.findOne({ email: userEmail }).then(user => {
                    if (user) {
                        return Promise.reject(' Email already exists');
                    }
                });
            }),
            // Validate the password field
            body("password").isLength({ min: 6 }).withMessage(" Password must be at least 6 characters long")
        ],
        authController.createUser
    );

// .../users/login
router.route("/login").post(authController.loginUser);


// .../users/logout
router.route("/logout").get(authController.logoutUser);

// .../users/:id
router.route("/:user").get(authController.getUser);

// .../users/:id/follow
router.route("/:user/follow").get(authController.followUser);

// .../users/:id/unfollow
router.route("/:user/unfollow").get(authController.unfollowUser);


// .../users/:id/followings
router.route("/:user/followings").get(authController.getFollowings);

// .../users/:id/followers
router.route("/:user/followers").get(authController.getFollowers);

// .../users/:id/favorites
router.route("/:user/favorites").get(authController.getFavorites);

// .../users/:id/updates
router.route("/:user/updates").get(authController.getUpdates);


// Export router
module.exports = router;