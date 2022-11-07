// Hooks
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
// Context
import { AuthContext } from '../../context/authContext';
// Components
import Link from 'next/link';
// Styles
import styles from './Navbar.module.css'

const Navbar = () => {
    // States & Context
    const { isAuthenticated, logOut } = useContext(AuthContext);
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    const handleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        router.push(`/search/${searchValue}`);
    };

    return (
        <nav className={styles.container}>
            <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.banner} src="/images/twitter.png" alt="twitter_logo" layout='fill' />
            </Link>
            <div className={styles.menu}>
                <div className={styles.menuList}>
                    {isAuthenticated && (
                        <div className={styles.menuPrivate}>
                            {!isSearchOpen &&
                                <>
                                    <Link href="/feed">Home</Link>
                                    <a name="search" onClick={() => setIsSearchOpen(true)} className={styles.switch}>Search</a>
                                    <Link href="/profile">Profile</Link>
                                    <a type="submit" name="button" onClick={logOut} className={styles.logout}>Logout</a>
                                </>}
                            {isSearchOpen &&
                                <>
                                    <input type="text" name="search" placeholder="Name or word" className={styles.search} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                                    <a name="search" onClick={handleSearch} className={styles.switch}>Search</a>
                                    <a name="search" onClick={() => setIsSearchOpen(false)} className={styles.switch}><i className="fa-regular fa-x"></i></a>
                                </>}
                        </div>
                    )}
                    {!isAuthenticated && (
                        <div className={styles.menuPublic}>
                            <Link href="/">Login</Link>
                            <Link href="/register">or Join Twitter!</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar