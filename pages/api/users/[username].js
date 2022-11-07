import User from '../../../models/User';
import Follow from '../../../models/follow';
import Tweet from '../../../models/tweet';
import Favorite from '../../../models/favorite';
import { getUserFromToken } from '../../../utils/functions';

export default async function GetUser(req, res) {
    try {
        // POST request body
        if (req.method === 'GET') {
            getUser(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const getUser = async (req, res) => {
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
        // Get follow info
        let isFollowing = await Follow.findOne({ from: userId, to: user._id });
        // Get tweets
        let tweets = await Tweet.find({ author: user._id }).sort({ date: -1 }).limit(20);
        // Get if user liked tweets and get likes count
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
        // Get sidebar info
        let following = await Follow.find({ from: user._id }).countDocuments();
        let followers = await Follow.find({ to: user._id }).countDocuments();
        let favorites = await Favorite.find({ user: user._id }).countDocuments();
        let updates = await Tweet.find({ author: user._id }).countDocuments();
        let followings = await Follow.find({ from: user._id }).limit(10).sort({ date: -1 }).populate('to');
        let followingImages = followings.map((following) => {
            return {
                image: following.to.image,
                username: following.to.username,
            }
        });
        let sidebarInfo = {
            followingCount: following,
            followersCount: followers,
            favoritesCount: favorites,
            updatesCount: updates,
            followingImages: followingImages,
            lastTweet: tweets.length > 0 ? tweets[0].tweet : "Not updated yet.",
        };
        // Return
        let userObj = {
            ...user.toObject(),
            isFollowing: isFollowing ? true : false,
        }
        res.status(200).send({ success: true, user: userObj, tweets: tweetsFinal, sidebarInfo });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};