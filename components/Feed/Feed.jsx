import { useState, useContext, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import NewTweet from "../NewTweet/NewTweet";
import { AuthContext } from "../../context/authContext";
import TweetRepository from "../../reposityory/TweetRepository";
import Tweet from "../Tweet/Tweet";
import Loading from "../Loading/Loading";
import styles from './Feed.module.css';

const Feed = () => {
    const { userInfo, isAuthenticated, loading, checkAuth } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(false);
    const [tab, setTab] = useState(0);
    const [recents, setRecents] = useState([]);
    const [all, setAll] = useState([]);

    const getTweets = () => {
        TweetRepository.getFeed({ _id: userInfo._id })
            .then(response => {
                setRecents(response.data.recents);
                setAll(response.data.all);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        checkAuth();
        getTweets();
    }, [refresh]);

    return (loading ? <Loading /> :
        (<div className={styles.container}>
            <div className={styles.main}>

                {isAuthenticated && <NewTweet setRefresh={setRefresh} refresh={refresh} />}

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${tab === 0 && 'active'}`} onClick={() => setTab(0)}>Recent</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${tab === 1 && 'active'}`} type="button" onClick={() => setTab(1)}>Everyone</button>
                    </li>
                </ul>

                {tab === 0 && recents.length > 0 && recents.map(recent => {
                    return <Tweet key={recent._id} tweet={recent} setRefresh={setRefresh} refresh={refresh} />;
                })}

                {tab === 1 && all.length > 0 && all.map(recent => {
                    return <Tweet key={recent._id} tweet={recent} setRefresh={setRefresh} refresh={refresh} />;
                })}

            </div>
            <Sidebar />
        </div>)
    );
}

export default Feed