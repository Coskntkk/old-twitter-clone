// Import modules
import { Schema, model, models } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Create a schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        allowNull: false,
    },
    role: {
        type: Number,
        default: 0,
    },
});

// Hash password before saving
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateJwt = function () {
    // Token never expires
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
    }, process.env.JWT_SECRET);
}

const User = models.User || model('User', userSchema);

export default User;