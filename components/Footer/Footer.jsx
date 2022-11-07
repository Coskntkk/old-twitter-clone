import styles from './Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.footer}>
            2022 <a href="https://github.com/Coskntkk">@dimaetor</a>
            <a className={styles.footerLink} href="#">About Us</a>
            <a className={styles.footerLink} href="#">Contact</a>
            <a className={styles.footerLink} href="#">Status</a>
            <a className={styles.footerLink} href="#">API</a>
            <a className={styles.footerLink} href="#">Help</a>
            <a className={styles.footerLink} href="#">Privacy</a>
        </div>
    )
}

export default Footer