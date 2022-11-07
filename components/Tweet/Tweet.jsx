/* eslint-disable @next/next/no-img-element */
// Context
import { AuthContext } from '../../context/authContext';
// Hooks
import { useContext } from 'react';
// Components
import Link from 'next/link';
// Repository
import TweetRepository from '../../reposityory/TweetRepository';
import FavRepository from '../../reposityory/FavRepository';

const Tweet = ({ tweet, setRefresh, refresh }) => {
    // States & Context
    const { userInfo } = useContext(AuthContext);

    const deleteTweet = () => {
        TweetRepository.deleteTweet({ _id: tweet._id })
            .then(response => {
                if (response.data.success) {
                    console.log('Tweet deleted');
                } else {
                    console.log('Error deleting tweet');
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setRefresh(!refresh);
            });
    };

    const favoriteTweet = () => {
        FavRepository.fav(tweet._id)
            .then(response => {
                if (response.data.success) {
                    console.log('Tweet favorited');
                } else {
                    console.log('Error favoriting tweet');
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setRefresh(!refresh);
            });
    };

    const unFavoriteTweet = () => {
        FavRepository.unfav(tweet._id)
            .then(response => {
                if (response.data.success) {
                    console.log('Tweet unfavorited');
                } else {
                    console.log('Error unfavoriting tweet');
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setRefresh(!refresh);
            });
    };

    return (
        <div className="container-fluid f-tweet-box">
            <img className="f-tweet-pp" src={`/images/${tweet.author.image}`} alt="" />
            <div className="col-9 f-tweet-content" style={{ wordBreak: 'break-word' }}>
                <Link href={`/users/${tweet.author.username}`}><b className="f-tweet-author"> {tweet.author.username} </b></Link>
                {tweet.author.role === 2 && <span style={{ color: "purple" }}>{" "}(👑)</span>}
                {tweet.author.role === 1 && <i style={{ color: "rgb(154, 228, 232)" }} className="fa-solid fa-circle-check"></i>}
                <span className="f-tweet-text"> {tweet.tweet} </span>
                <div className="f-tweet-bottom" style={{ display: "block" }}>
                    <span className="f-tweet-date"> {tweet.date.split("T")[0] + " " + tweet.date.split("T")[1].split(":")[0] + ":" + tweet.date.split("T")[1].split(":")[1]} </span>
                    <a href={`/tweets/${tweet._id}`}><i className="fas fa-reply f-reply"></i></a>
                    {" "}
                    {tweet.author._id !== userInfo._id && (tweet.liked ?
                        <button type="submit" name="button" className="hidden-button" onClick={unFavoriteTweet}>
                            <i className="fas fa-star f-faved"></i>
                        </button>
                        :
                        <button type="submit" name="button" className="hidden-button" onClick={favoriteTweet}>
                            <i className="far fa-star f-unfaved"></i>
                        </button>
                    )}
                    {tweet.likesCount > 0 && <span>{tweet.likesCount}</span>}
                    {" "}
                    {tweet.author.username === userInfo.username && (
                        <button type="submit" name="button" className="hidden-button" onClick={deleteTweet}>
                            <i className="far fa-trash-alt f-del"></i>
                        </button>
                    )}
                </div>
            </div>
            <hr className="f-tweet-hr" />
        </div>
    )
}

export default Tweet