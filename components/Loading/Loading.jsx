import styles from './Loading.module.css'

const Loading = () => {
    return (
        <div className={styles.container}>
            <div className={styles.white}>
                <i className="fa-brands fa-twitter fa-beat-fade fa-5x"></i>
            </div>
            <div className={styles.green}>
                <i className="fa-brands fa-twitter fa-beat-fade fa-5x"></i>
            </div>
        </div>
    )
}

export default Loading