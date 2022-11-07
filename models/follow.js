// Import modules
import { Schema, model, models } from 'mongoose';

// Create a schema
const followSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Follow = models.Follow || model('Follow', followSchema);

export default Follow;