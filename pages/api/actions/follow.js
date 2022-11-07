import Follow from '../../../models/follow';
import { getUserFromToken } from '../../../utils/functions';

export default async function FollowUser(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            follow(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const follow = async (req, res) => {
    try {
        let userId = await getUserFromToken(req.cookies.token);
        let userIdToFolow = req.body.userId;
        await Follow.create({
            from: userId,
            to: userIdToFolow,
        });
        res.status(201).send({ success: true, message: 'User followed.' });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};