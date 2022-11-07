// Components
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
// Styles
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Navbar />
            <div className="arrow-up"></div>
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )

}
export default MainLayout;