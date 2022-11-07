import Favorite from '../../../models/favorite';
import { getUserFromToken } from '../../../utils/functions';

export default async function FavoriteTweet(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            favorite(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const favorite = async (req, res) => {
    try {
        let userId = await getUserFromToken(req.cookies.token);
        let tweetIdToFav = req.body.tweetId;
        await Favorite.create({
            user: userId,
            tweet: tweetIdToFav,
        });
        res.status(201).send({ success: true, message: 'Tweet added to favorites.' });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};