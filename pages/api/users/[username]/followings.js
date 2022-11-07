import User from '../../../../models/user';
import Follow from '../../../../models/follow';
import { getUserFromToken } from '../../../../utils/functions';

export default async function GetUserFollowings(req, res) {
    try {
        // POST request body
        if (req.method === 'GET') {
            getUserFollowings(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const getUserFollowings = async (req, res) => {
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
        // Get followers of user
        let followings = await Follow.find({ from: user._id }).sort({ date: -1 }).limit(20).populate('to');
        followings = followings.map((follower) => follower.to);
        // Get isFollowing for each follower
        let followingsFinal = followings.map(async (user) => {
            let isFollowing = await Follow.findOne({ from: userId, to: user._id });
            return {
                ...user._doc,
                isFollowing: isFollowing ? true : false
            }
        });
        followingsFinal = await Promise.all(followingsFinal);
        res.status(200).send({ success: true, followings: followingsFinal });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};