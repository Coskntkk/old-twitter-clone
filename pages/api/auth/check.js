import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user';
import Tweet from '../../../models/tweet';
import Favorite from '../../../models/favorite';
import Follow from '../../../models/follow';
import { getUserFromToken } from '../../../utils/functions';

export default async function Check(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            check(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const check = async (req, res) => {
    try {
        let userId = await getUserFromToken(req.cookies.token);
        await connectMongo();
        const user = await User.findOne({_id: userId});
        if (!user) {
            res.status(400).send({ success: false, message: 'User not found.'});
            return;
        }
        // remove password from user object
        let userObj = user.toObject();
        delete userObj.password;
        let lastTweet = await Tweet.findOne({ author: user._id }).sort({ date: -1 }) || {};
        userObj.lastTweet = lastTweet.tweet || "Not updated yet."
        userObj.followingCount = await Follow.find({ from: user._id }).count();
        userObj.followersCount = await Follow.find({ to: user._id }).count();
        userObj.favoritesCount = await Favorite.find({ user: user._id }).count();
        userObj.updatesCount = await Tweet.find({ author: user._id }).count();
        let followings = await Follow.find({ from: user._id }).limit(10).sort({ date: -1 }).populate('to');
        userObj.followingImages = followings.map((following) => {
            return {
                image: following.to.image,
                username: following.to.username,
            }
        });
        res.status(200).send({ success: true, message: 'Authenticated.', user: userObj });
        return;
    } catch (err) {
        console.log(err);
        // Redirect to login page if error occurs
        res.status(400).send({ success: false, message: err.message });
    }
}