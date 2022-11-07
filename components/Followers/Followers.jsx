import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Followers.module.css';
import FollowRepository from '../../reposityory/FollowRepository';
import Sidebar from '../Sidebar/Sidebar';
import Link from 'next/link';
import User from '../User/User';

const Followers = () => {
    const router = useRouter();
    const { username } = router.query;
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        username && FollowRepository.getFollowers(username)
            .then((response) => {
                setFollowers(response.data.followers);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

    return (
        username && <div className={styles.container}>
            <div className={styles.main}>
                <span> Followers of <Link href={`/users/${username}`}>{username}</Link></span>
                {followers.map((user) => <User key={user._id} user={user} />)}
            </div>
            <Sidebar />
        </div>
    )
}

export default Followers