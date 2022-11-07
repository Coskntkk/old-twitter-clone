import { useEffect, useState, useContext } from 'react';
import UserRepository from '../../reposityory/UserRepository';
import TweetRepository from '../../reposityory/TweetRepository';
import { AuthContext } from "../../context/authContext";
import Sidebar from '../Sidebar/Sidebar';
import Loading from '../Loading/Loading';
import styles from './UserProfile.module.css';
import Link from 'next/link';

const UserProfile = () => {
  const [refresh, setRefresh] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lastTweet, setLastTweet] = useState(null);
  const [tweets, setTweets] = useState([]);
  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const getUserInfo = async () => {
    UserRepository.getUser(userInfo.username, userInfo._id)
      .then((response) => {
        setUser(response.data.user);
        let tweetsRaw = response.data.tweets;
        let lastTweet = tweetsRaw[0];
        setLastTweet(lastTweet);
        tweetsRaw.shift();
        setTweets(tweetsRaw);
        let sidebarRaw = {
          ...response.data.user,
          ...response.data.sidebarInfo
        }
        setSidebarInfo(sidebarRaw);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }

  const deleteTweet = (id) => {
    TweetRepository.deleteTweet({ _id: id })
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
  }

  useEffect(() => {
    userInfo.username && getUserInfo();
  }, [userInfo, refresh]);

  return (
    !pageLoading
      ?
      <div className={styles.container}>
        <div className={styles.profile}>
          <div className="container-fluid p-last-tweet-box">
            <div className="p-last-tweet-top">
              <img className="f-tweet-pp" src={`/images/${user.image}`} alt="" />
              <span href="" className="p-last-tweet-author disabled">  {user.username}  </span>
                {user.role === 2 && <span style={{ color: "purple" }}>{" "}(👑)</span>}
                {user.role === 1 && <i style={{ color: "rgb(154, 228, 232)" }} className="fa-solid fa-circle-check"></i>}
            </div>
            {/* <!-- LAST TWEET --> */} 
            {lastTweet &&
              <>
                <p className="p-last-tweet-text p-p" style={{ wordBreak: 'break-word'}}>{lastTweet.tweet || "Not updated yed."}</p>
                <p className="p-last-tweet-date p-p" style={{ display: "inline-block", color: "darkgray" }}>{lastTweet.date.split("T")[0] + " " + lastTweet.date.split("T")[1].split(":")[0] + ":" + lastTweet.date.split("T")[1].split(":")[1]}{" "}</p>
                <Link href={`/tweets/${lastTweet._id}`}><i className="fas fa-reply f-reply"></i></Link>
                <button type="submit" name="button" className="hidden-button" onClick={() => deleteTweet(lastTweet._id)}>
                  <i className="far fa-trash-alt f-del"></i>
                </button>
              </>
            }
          </div>
          {lastTweet.likesCount > 0 && <span> {lastTweet.likesCount} </span>}
          <hr className="f-tweet-hr" />

          {tweets.length > 0 &&
            tweets.map((tweet) => {
              return (
                <div className="container-fluid f-tweet-box" key={tweet._id}>
                  <div className="f-tweet-content">
                    <span className="p-tweet-text">{tweet.tweet}{" "}</span>
                    <span className="p-tweet-date">{tweet.date.split("T")[0] + " " + tweet.date.split("T")[1].split(":")[0] + ":" + tweet.date.split("T")[1].split(":")[1]}</span>
                    <Link href={`/tweets/${tweet._id}`} ><i className="fas fa-reply f-reply"></i></Link>
                    {" "}
                    <button type="submit" name="button" className="hidden-button" onClick={() => deleteTweet(tweet._id)}>
                      <i className="far fa-trash-alt f-del"></i>
                    </button>
                    {" "}
                    {tweet.likesCount > 0 && <span> {tweet.likesCount} </span>}
                  </div>
                  <hr className="f-tweet-hr" />
                </div>
              )
            })
          }
        </div>
        <Sidebar />
      </div>
      : <Loading />
  );
}

export default UserProfile