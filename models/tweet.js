// Import modules
import { Schema, model, models } from 'mongoose';

// Create a schema
const tweetSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tweet: {
        type: String,
        allowNull: false
    },
    date: {
        type: Date,
        default: Date.now,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
});

const Tweet = models.Tweet || model('Tweet', tweetSchema);

export default Tweet;