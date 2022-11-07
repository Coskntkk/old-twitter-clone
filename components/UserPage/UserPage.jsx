import { useEffect, useState, useContext } from 'react';
import UserPageSidebar from './UserPageSidebar/UserPageSidebar';
import UserRepository from '../../reposityory/UserRepository';
import FollowRepository from '../../reposityory/FollowRepository';
import FavRepository from '../../reposityory/FavRepository';
import { AuthContext } from "../../context/authContext";
import Loading from '../Loading/Loading';
import styles from './UserPage.module.css';
import Link from 'next/link';

const UserPage = ({ username }) => {
  const [refresh, setRefresh] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lastTweet, setLastTweet] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [sidebarInfo, setSidebarInfo] = useState(null);
  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const getUserInfo = async () => {
    UserRepository.getUser(username, userInfo._id)
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

  const followUser = async () => {
    FollowRepository.follow(user._id)
      .then(response => {
        if (response.data.success) {
          console.log('User followed');
        } else {
          console.log('Error following user');
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setUser({
          ...user,
          isFollowing: true
        })
        getUserInfo();
      });
  }

  const unfollowUser = async () => {
    FollowRepository.unfollow(user._id)
      .then(response => {
        if (response.data.success) {
          console.log('User unfollowed');
        } else {
          console.log('Error unfollowing user');
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setUser({
          ...user,
          isFollowing: false
        })
        getUserInfo();
      });
  }

  const favTweet = async (id) => {
    setPageLoading(true);
    FavRepository.fav(id)
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
        setPageLoading(false);
      });
  }

  const unfavTweet = async (id) => {
    setPageLoading(true);
    FavRepository.unfav(id)
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
        setPageLoading(false);
      });
  }

  useEffect(() => {
    username && getUserInfo();
  }, [username, refresh]);

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
            {isAuthenticated &&
              user.isFollowing ?
              <button className="follow-button" type="submit" name="button" onClick={unfollowUser}>Unfollow</button>
              :
              <button className="follow-button" type="submit" name="button" onClick={followUser}>Follow</button>
            }
            {/* <!-- LAST TWEET --> */}
            {lastTweet &&
              <>
                <p className="p-last-tweet-text p-p">  {lastTweet.tweet || "Not updated yed."}  </p>
                <p className="p-last-tweet-date p-p" style={{ display: "inline-block", color: "darkgray" }}>{lastTweet.date.split("T")[0] + " " + lastTweet.date.split("T")[1].split(":")[0] + ":" + lastTweet.date.split("T")[1].split(":")[1]}</p>
                <Link href={`/tweets/${lastTweet._id}`} ><i className="fas fa-reply f-reply"></i></Link>
                {lastTweet.liked &&
                  <button type="submit" name="button" className="hidden-button" onClick={() => unfavTweet(lastTweet._id)}>
                    <i className="fas fa-star f-faved"></i>
                  </button>
                }
                {!lastTweet.liked &&
                  <button type="submit" name="button" className="hidden-button" onClick={() => favTweet(lastTweet._id)}>
                    <i className="far fa-star f-unfaved"></i>
                  </button>
                }
                {lastTweet.likesCount > 0 && <span> {lastTweet.likesCount} </span>}
              </>
            }
          </div>
          <hr className="f-tweet-hr" />

          {tweets.length > 0 &&
            tweets.map((tweet) => {
              return (
                <div className="container-fluid f-tweet-box" key={tweet._id}>
                  <div className="f-tweet-content">
                    <span className="p-tweet-text">{tweet.tweet}{" "}</span>
                    <span className="p-tweet-date">{tweet.date.split("T")[0] + " " + tweet.date.split("T")[1].split(":")[0] + ":" + tweet.date.split("T")[1].split(":")[1]}{" "}</span>
                    <Link href={`/tweets/${tweet._id}`} ><i className="fas fa-reply f-reply"></i></Link>
                    {tweet.liked &&
                      <button type="submit" name="button" className="hidden-button" onClick={() => unfavTweet(tweet._id)}>
                        <i className="fas fa-star f-faved"></i>
                      </button>
                    }
                    {!tweet.liked &&
                      <button type="submit" name="button" className="hidden-button" onClick={() => favTweet(tweet._id)}>
                        <i className="far fa-star f-unfaved"></i>
                      </button>
                    }
                    {tweet.likesCount > 0 && <span> {tweet.likesCount} </span>}
                  </div>
                  <hr className="f-tweet-hr" />
                </div>
              )
            })
          }
        </div>
        <UserPageSidebar sidebarInfo={sidebarInfo} />
      </div>
      : <Loading />
  );
}

export default UserPage