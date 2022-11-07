import { useState, useEffect } from 'react';
import SearchRepository from '../../reposityory/SearchRepository';
import Sidebar from "../Sidebar/Sidebar";
import Loading from "../Loading/Loading";
import styles from './SearchResult.module.css';
import Tweet from '../Tweet/Tweet';
import User from '../User/User';

const SearchResult = ({ keyword }) => {
    const [refresh, setRefresh] = useState(false);
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [tweets, setTweets] = useState([]);

    const search = async () => {
        const response = await SearchRepository.search(keyword);
        if (response.data.success) {
            console.log(response.data);
            setUsers(response.data.users);
            setTweets(response.data.tweets);
        }
    };

    useEffect(() => {
        keyword && search();
    }, [keyword]);

    return (
        keyword ? (
            <div className={styles.container}>
                <main className={styles.main}>

                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${tab === 0 && 'active'}`} onClick={() => setTab(0)}>Tweets</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${tab === 1 && 'active'}`} type="button" onClick={() => setTab(1)}>Users</button>
                        </li>
                    </ul>

                    {tab === 0 && tweets.length > 0 && tweets.map(tweet => {
                        return <Tweet key={tweet._id} tweet={tweet} setRefresh={setRefresh} refresh={refresh} />;
                    })}

                    {tab === 1 && users.length > 0 && users.map(user => {
                        return <User key={user._id} user={user} setRefresh={setRefresh} refresh={refresh} />;
                    })}

                </main>
                <Sidebar />
            </div>
        ) : (
            <Loading />
        )
    )
}

export default SearchResult