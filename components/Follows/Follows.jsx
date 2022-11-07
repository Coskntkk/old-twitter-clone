import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Follows.module.css';
import FollowRepository from '../../reposityory/FollowRepository';
import Sidebar from '../Sidebar/Sidebar';
import Link from 'next/link';
import User from '../User/User';

const Follows = () => {
    const router = useRouter();
    const { username } = router.query;
    const [follows, setFollows] = useState([]);

    useEffect(() => {
        username && FollowRepository.getFollowing(username)
            .then((response) => {
                setFollows(response.data.followings);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

    return (
        username && <div className={styles.container}>
            <div className={styles.main}>
                <span> Follows of <Link href={`/users/${username}`}>{username}</Link></span>
                {follows.map((user) => <User key={user._id} user={user} />)}
            </div>
            <Sidebar />
        </div>
    )
}

export default Follows