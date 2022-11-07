import Tweet from '../../../models/tweet';
import Favorite from '../../../models/favorite';

export default async function DeleteTweet(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            deleteTw(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const deleteTw = async (req, res) => {
    try {
        let tweetId = req.body._id;
        const tweet = await Tweet.findById(tweetId);
        await Favorite.deleteMany({tweet: tweet._id});
        await Tweet.deleteOne({ _id: tweetId });
        res.status(200).send({ success: true, message: 'Tweet deleted' });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};