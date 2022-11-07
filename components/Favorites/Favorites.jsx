import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Favorites.module.css';
import FavRepository from '../../reposityory/FavRepository';
import Sidebar from '../Sidebar/Sidebar';
import Link from 'next/link';
import Tweet from '../Tweet/Tweet';

const Favorites = () => {
    const router = useRouter();
    const { username } = router.query;
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        username && FavRepository.getFavs(username)
            .then((response) => {
                setFavorites(response.data.tweets);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

    return (
        username && <div className={styles.container}>
            <div className={styles.main}>
                <span> Favorites of <Link href={`/users/${username}`}>{username}</Link></span>
                {favorites.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)}
            </div>
            <Sidebar />
        </div>
    )
}

export default Favorites