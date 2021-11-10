const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const slugify = require('slugify');

const userSchema = new Schema({
    user: {
        type: String,
        required: true,
    }, // Unique name of account
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    }, // Email
    password: {
        type: String,
        required: true,
    }, // Password
    nick: {
      type: String,
      required: true,
      unique: true 
    }, // Nickname
    image: String, // Profile image url
    following: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ], // List of following accounts
    followers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ], // List of follower accounts
    updates: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tweet",
        },
      ],  // List of tweet id's
    favorites: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tweet",
        },
      ],  // List of liked tweets's ids
    lastTweet: String, // Text of last update
    followingImages: [String], // List of following accounts profile images
});

userSchema.pre("save", function(next){
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      next();
    });
});

userSchema.pre("validate", function(next){
    this.user = slugify(this.user, {
      lower: true,
      strict: true,
    });
    next();
});

module.exports = mongoose.model('User', userSchema);