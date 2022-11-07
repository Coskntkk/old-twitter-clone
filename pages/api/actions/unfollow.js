import Follow from '../../../models/follow';
import { getUserFromToken } from '../../../utils/functions';

export default async function UnfollowUser(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            unfollow(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const unfollow = async (req, res) => {
    try {
        let userId = await getUserFromToken(req.cookies.token);
        let userIdToFolow = req.body.userId;
        await Follow.deleteOne({
            from: userId,
            to: userIdToFolow,
        });
        res.status(201).send({ success: true, message: 'User unfollowed.' });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};