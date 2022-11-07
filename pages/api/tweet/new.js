import connectMongo from '../../../utils/connectMongo';
import Tweet from '../../../models/tweet';
import { getUserFromToken } from '../../../utils/functions';

export default async function NewTweet(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            newTweet(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const newTweet = async (req, res) => {
    try {
        let userId = await getUserFromToken(req.cookies.token);
        await Tweet.create({
            author: userId,
            tweet: req.body.tweet,
            parent: null
        });
        res.status(201).send({ success: true, message: 'Tweet created' });
    } catch (err) {
        // Go back if error occurs
        res.status(400).send({success: false, message: err.message});
    }
};