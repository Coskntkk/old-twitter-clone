import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './ER404.module.css';

const ER404 = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <i className="fa-brands fa-twitter fa-spin fa-10x"></i>
            <h1>404</h1>
            <h2>Page not found</h2>
            <Link href="/">
                Return home
            </Link>
        </div>
    )
}

export default ER404