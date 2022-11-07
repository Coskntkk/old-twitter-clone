// Context
import { AuthContext } from '../../context/authContext';
// Hooks
import { useContext } from 'react';
// Style
import styles from './Sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
    // States & Context
    const { userInfo, isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated) {
        return (
            <div className={`col-lg-4 col-sm-12 ${styles.container}`}>
                <div className={styles.main}>
                    <div className="f-green-sec">
                        <div className="d-flex justify-content-between">
                            <b>Hi,</b>
                            <a href={`/users/${userInfo.username}`}>your profile</a>
                        </div>
                        <hr className="f-green-hr" />
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="f-pp" src={`/images/${userInfo.image}`} alt="" />{" "}
                            <p className="f-gUsername" style={{ display: "inline-block" }}> {userInfo.username} </p>
                            {userInfo.role === 2 && <span style={{ color: "purple" }}>{" "}(👑)</span>}
                            {userInfo.role === 1 && <i style={{ color: "rgb(154, 228, 232)" }} className="fa-solid fa-circle-check"></i>}
                        </div>
                    </div><br />
                    <div style={{ wordBreak: 'break-word' }}>
                        <b>Currently</b>
                        <hr className="f-green-hr" />
                        <a className="l-green-id" href={`/users/${userInfo.username}`}>@{userInfo.username} </a>
                        <p className="l-green-last-tweet" style={{ display: "inline-block" }}> {userInfo.lastTweet} </p>
                    </div><br />
                    <div className="f-green-sec">
                        <b>Stats</b>
                        <hr className="f-green-hr" />
                        <div className="d-flex justify-content-between">
                            <Link className="stats-link" href={`/users/${userInfo.username}/followings`}>Following</Link>
                            <span> {userInfo.followingCount} </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Link className="stats-link" href={`/users/${userInfo.username}/followers`}>Followers</Link>
                            <span> {userInfo.followersCount} </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Link className="stats-link" href={`/users/${userInfo.username}/favorites`}>Favorites</Link>
                            <span> {userInfo.favoritesCount} </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="stats-link">Updates</div>
                            <span> {userInfo.updatesCount} </span>
                        </div>
                    </div><br />
                    {userInfo.followingImages.length > 0 && <div className="f-green-sec">
                        <b>Following</b>
                        <hr className="f-green-hr" />
                        {userInfo.followingImages.map((item) => {
                            // eslint-disable-next-line @next/next/no-img-element
                            return <Link href={`/users/${item.username}`} key={item.username} ><img className="f-pp" src={`/images/${item.image}`} alt="" /></Link>
                        })}
                    </div>}
                </div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <div className="col-lg-4 f-green-big">
                <div className="f-green" style={{ textAlign: "left", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <h5>Already a member? <a href="/">Sign In!</a></h5>
                    <p>Already use Twitter on your phone? <a href="#">Head over here</a> and we&apos;ll get you signed up on the web.</p>
                </div>
            </div>
        );
    }
}

export default Sidebar