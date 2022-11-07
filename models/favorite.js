// Import modules
import { Schema, model, models } from 'mongoose';

// Create a schema
const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
});

const Favorite = models.Favorite || model('Favorite', favoriteSchema);

export default Favorite;