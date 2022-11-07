import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user';
import Tweet from '../../../models/tweet';
import Follow from '../../../models/follow';
import { getUserFromToken } from '../../../utils/functions';
import Favorite from '../../../models/favorite';

export default async function Feed(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            getFeed(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const getFeed = async (req, res) => {
    try {
        // Get the user
        let userId = await getUserFromToken(req.cookies.token);
        let recents;
        if (!userId) {
            let recentsList = await Tweet.find({}).limit(10).sort({ date: -1 }).populate('author', ['-password', '-email', '-__v']);
            recents = await Promise.all(
                recentsList.map(async (item) => {
                    let favorites = await Favorite.find({ tweet: item._id });
                    let ret = item.toObject();
                    ret.favorites = favorites;
                    return ret;
                })
            );
        } else {
            // Gets a list of user and his followings
            let followings = await Follow.find({ from: userId })
            let allTweetsFrom = followings.map((item) => item.to);
            allTweetsFrom.push(userId);
            // Get tweets from user and its followings
            let recentsList = await Tweet.find({ author: { $in: allTweetsFrom } }).sort({ date: -1 }).populate('author', ['-password', '-email', '-__v']);
            recents = await Promise.all(
                recentsList.map(async (item) => {
                    let favorites = await Favorite.find({ tweet: item._id });
                    let ret = item.toObject();
                    ret.favorites = favorites;
                    return ret;
                })
            );
        }
        // Get tweets from all users
        let allList = await Tweet.find({}).limit(10).sort({ date: -1 }).populate('author', ['-password', '-email', '-__v']);
        let all = await Promise.all(
            allList.map(async (item) => {
                let favorites = await Favorite.find({ tweet: item._id });
                let ret = item.toObject();
                ret.favorites = favorites;
                return ret;
            })
        );
        /// Populate the response
        // Recents
        let recentsFinal = recents.map(async (tweet) => {
            let liked = await Favorite.findOne({ tweet: tweet._id, user: userId });
            let likesCount = await Favorite.countDocuments({ tweet: tweet._id });
            return {
                ...tweet,
                liked: liked ? true : false,
                likesCount: likesCount
            }
        });
        recentsFinal = await Promise.all(recentsFinal);
        // All
        let allFinal = all.map(async (tweet) => {
            let liked = await Favorite.findOne({ tweet: tweet._id, user: userId });
            let likesCount = await Favorite.countDocuments({ tweet: tweet._id });
            return {
                ...tweet,
                liked: liked ? true : false,
                likesCount: likesCount
            }
        });
        allFinal = await Promise.all(allFinal);
        // Feed page with needed values
        res.status(200).send({ success: true, recents: recentsFinal, all: allFinal });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, error: err });
    }
};