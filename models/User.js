// Import modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const slugify = require('slugify');

// Create a schema
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
    followingImages: [String],
});

// Hash password before saving
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

// Create username from name
userSchema.pre("validate", function(next){
  this.user = (!this.user) ? slugify(this.user, {lower: true,strict: true}) : this.user;
  next();
});

// Export the model
module.exports = mongoose.model('User', userSchema);