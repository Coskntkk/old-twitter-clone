import User from '../../../../models/user';
import Follow from '../../../../models/follow';
import { getUserFromToken } from '../../../../utils/functions';

export default async function GetUserFollowers(req, res) {
    try {
        // POST request body
        if (req.method === 'GET') {
            getUserFollowers(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const getUserFollowers = async (req, res) => {
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
        let followers = await Follow.find({ to: user._id }).sort({ date: -1 }).limit(20).populate('from');
        followers = followers.map((follower) => follower.from);
        // Get isFollowing for each follower
        let followersFinal = followers.map(async (user) => {
            let isFollowing = await Follow.findOne({ from: userId, to: user._id });
            return {
                ...user._doc,
                isFollowing: isFollowing ? true : false
            }
        });
        followersFinal = await Promise.all(followersFinal);
        res.status(200).send({ success: true, followers: followersFinal });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};