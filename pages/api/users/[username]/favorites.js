import User from '../../../../models/user';
import Favorite from '../../../../models/favorite';
import { getUserFromToken } from '../../../../utils/functions';

export default async function GetUserFavs(req, res) {
    try {
        // POST request body
        if (req.method === 'GET') {
            getUserFavs(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const getUserFavs = async (req, res) => {
    try {
        // Get info from request
        let username = req.query.username;
        let userId = await getUserFromToken(req.cookies.token);
        // Get user
        const user = await User.findOne({ username: username }).select(['-password', '-email', '-__v']);
        if (!user) {
            res.status(400).send({ success: false, message: 'User not found.' });
            return;
        }
        // Get tweets favorited by user
        let tweets = await Favorite.find({ user: user._id }).sort({ date: -1 }).limit(20).populate('tweet');
        tweets = tweets.map((tweet) => tweet.tweet);
        // Get liked and likecount for each tweet
        let tweetsFinal = tweets.map(async(tweet) => {
            let liked = await Favorite.findOne({ user: userId, tweet: tweet._id });
            let likesCount = await Favorite.countDocuments({ tweet: tweet._id });
            return { ...tweet._doc, liked: liked ? true : false, likesCount: likesCount };
        });
        tweetsFinal = await Promise.all(tweetsFinal);
        res.status(200).send({ success: true, tweets: tweetsFinal });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};