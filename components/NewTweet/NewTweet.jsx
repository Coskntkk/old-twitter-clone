import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import TweetRepository from '../../reposityory/TweetRepository';
import styles from './NewTweet.module.css';

const NewTweet = ({ setRefresh, refresh }) => {
    const { userInfo } = useContext(AuthContext);
    const [tweet, setTweet] = useState('');
    const [status, setStatus] = useState({
        success: null,
        message: ''
    });
    const submitTweet = (e) => {
        if (tweet.length > 0) {
            e.preventDefault();
            let body = {
                tweet: tweet,
                _id: userInfo._id,
            };
            TweetRepository.newTweet(body)
                .then(response => {
                    if (response.data.success) {
                        setStatus({
                            success: true,
                            message: response.data.message
                        });
                    } else {
                        setStatus({
                            success: false,
                            message: response.data.message
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    setStatus({
                        success: false,
                        message: err.message
                    });
                })
                .finally(() => {
                    setTweet('');
                });
            setRefresh(!refresh);
        }
    }
    return (
        <div className={styles.container}>
            {status.success !== null && <div className={`alert alert-${status.success === true ? 'success' : 'danger'}`}>
                {status.message}
            </div>}
            <div className="d-flex justify-content-between">
                <h3 className="f-title">What are you doing?</h3>
                <h2 className="f-140">{140 - tweet.length}</h2>
            </div>
            <textarea
                className="form-control"
                id="newTweet"
                rows="3"
                maxLength="140"
                style={{ resize: "none" }}
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
            ></textarea>
            <div className={styles.btnContainer}>
                <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => submitTweet(e)}
                    disabled={tweet.length === 0}
                >
                    update
                </button>
            </div>
        </div>)
}

export default NewTweet