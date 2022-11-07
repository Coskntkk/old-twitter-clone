import Link from "next/link";
import styles from "./UserPageSidebar.module.css";

const UserPageSidebar = ({ sidebarInfo }) => {
    return (
        <div className={`col-lg-4 col-sm-12 ${styles.container}`}>
            <div className={styles.main}>
                <div className="f-green-sec">
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="f-pp" src={`/images/${sidebarInfo.image}`} alt="" />{" "}
                        <p className="f-gUsername" style={{ display: "inline-block" }}> {sidebarInfo.username} </p>
                        {" "}
                        {sidebarInfo.role === 2 && <span style={{ color: "purple" }}>{" "}(👑)</span>}
                        {sidebarInfo.role === 1 && <i style={{ color: "rgb(154, 228, 232)" }} className="fa-solid fa-circle-check"></i>}
                    </div>
                </div><br />
                <div style={{ wordBreak: 'break-word' }}>
                    <b>Currently</b>
                    <hr className="f-green-hr" />
                    <a className="l-green-id" href={`/users/${sidebarInfo.username}`}>@{sidebarInfo.username} </a>
                    <p className="l-green-last-tweet" style={{ display: "inline-block" }}> {sidebarInfo.lastTweet} </p>
                </div><br />
                <div className="f-green-sec">
                    <div className="d-flex justify-content-between">
                        <b>Device updates</b>
                        <a href="#">add device</a>
                    </div>
                    <hr className="f-green-hr" />
                    <div>
                        <input type="radio" name="" value="" /><span> phone</span> <br />
                        <input type="radio" name="" value="" /><span> web only</span>
                    </div>
                </div><br />
                <div className="f-green-sec">
                    <b>Stats</b>
                    <hr className="f-green-hr" />
                    <div className="d-flex justify-content-between">
                        <Link className="stats-link" href={`/users/${sidebarInfo.username}/followings`}>Following</Link>
                        <span> {sidebarInfo.followingCount} </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Link className="stats-link" href={`/users/${sidebarInfo.username}/followers`}>Followers</Link>
                        <span> {sidebarInfo.followersCount} </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Link className="stats-link" href={`/users/${sidebarInfo.username}/favorites`}>Favorites</Link>
                        <span> {sidebarInfo.favoritesCount} </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="stats-link">Updates</div>
                        <span> {sidebarInfo.updatesCount} </span>
                    </div>
                </div><br />
                {sidebarInfo.followingImages.length > 0 &&<div className="f-green-sec">
                    <b>Following</b>
                    <hr className="f-green-hr" />
                    {sidebarInfo.followingImages.map((item) => {
                        // eslint-disable-next-line @next/next/no-img-element
                        return <Link href={`/users/${item.username}`} key={item.username} ><img className="f-pp" src={`/images/${item.image}`} alt="" /></Link>
                    })}
                </div>}
            </div>
        </div>
    );
};

export default UserPageSidebar