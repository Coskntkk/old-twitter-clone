// Import modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const tweetSchema = {
    tweeter: String, // Display name of author
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }, // ID of author
    tweet: String, // Content of tweet
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],  // liked accounts
    date: {
        type: Date,
        default: Date.now,
    }, // Date
    img: String, // Profile image of author
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    }   // parent tweet if it is a reply
}

// Export the model
module.exports = mongoose.model('Tweet', tweetSchema);