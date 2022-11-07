import User from '../../../models/user';
import Follow from '../../../models/follow';
import Tweet from '../../../models/tweet';
import Favorite from '../../../models/favorite';
import { getUserFromToken } from '../../../utils/functions';

export default async function Search(req, res) {
    try {
        // POST request body
        if (req.method === 'GET') {
            search(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const search = async (req, res) => {
    try {
        // Get info from request
        let keyword = req.query.keyword;
        let userId = await getUserFromToken(req.cookies.token);

        // Get search users
        let users = await User.find({ username: { $regex: keyword, $options: 'i' } }).select(['-password', '-email', '-__v']);
        let usersFinal = users.map(async (user) => {
            let isFollowing = await Follow.findOne({ from: userId, to: user._id });
            return {
                ...user._doc,
                isFollowing: isFollowing ? true : false
            }
        });
        usersFinal = await Promise.all(usersFinal);

        // Get search tweets
        // Populate author but don't show password and email
        let tweets = await Tweet.find({ tweet: { $regex: keyword, $options: 'i' } }).sort({ date: -1 }).limit(20).populate('author', ['-password', '-email', '-__v']);
        let tweetsFinal = tweets.map(async (tweet) => {
            let liked = await Favorite.findOne({ tweet: tweet._id, user: userId });
            let likesCount = await Favorite.countDocuments({ tweet: tweet._id });
            return {
                ...tweet._doc,
                liked: liked ? true : false,
                likesCount: likesCount
            }
        });
        tweetsFinal = await Promise.all(tweetsFinal);

        // Return
        res.status(200).send({ success: true, users: usersFinal, tweets: tweetsFinal });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: 'Something went wrong.' });
    }
}