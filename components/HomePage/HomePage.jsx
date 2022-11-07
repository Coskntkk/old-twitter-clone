import { useState } from 'react';
import Login from '../Login/Login';
import styles from './HomePage.module.css';

const HomePage = () => {
    const [index, setIndex] = useState(0);
    const quests = ["What", "Why", "How"];
    const texts = [
        "Twitter is a service for friends, family, anc co-workers to communicate and stay connected through the exchange of quick, frequent answers to one simple questions: ",
        "Twitter is easy to use and it is completely free. Communicating with your friends, family and co-workers has never been this easy. Most of all, the most important thing is; Twitter is ",
        "All you have to do is create an account and find whoever you want! You can connect, communicate and get know about them with Twitter. Click the button below and get started! It is "
    ];
    const lasts = ["What are you doing?", "completely safe.", "really easy."];
    return (
        <div className={styles.container}>
            <div className="row l-row">
                <div className="col-lg-8">
                    <div className="login-top">
                        <h3 className="l-what-is-twitter"><strong><span className="l-header-wwh">{quests[index]}</span> is Twitter?</strong></h3>
                        <form className="l-what-why-how">
                            <button type="button" className={`btn btn-outline-secondary l-wwh-button ${index === 2 ? 'l-wwh-enabled' : 'l-wwh-disabled'}`} onClick={() => setIndex(2)}>How?</button>
                            <button type="button" className={`btn btn-outline-secondary l-wwh-button ${index === 1 ? 'l-wwh-enabled' : 'l-wwh-disabled'}`} onClick={() => setIndex(1)}>Why?</button>
                            <button type="button" className={`btn btn-outline-secondary l-wwh-button ${index === 0 ? 'l-wwh-enabled' : 'l-wwh-disabled'}`} onClick={() => setIndex(0)}>What?</button>
                        </form>
                    </div>
                    <div className="login-mid">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="images/loginLogo.png" className="l-login-image" alt='logo' />
                        <p className="l-twitter-paragraph">{texts[index]} <strong>{lasts[index]}</strong> </p>
                    </div>
                    <div className="l-login-bot">
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a type="button" href="/register" className="btn btn-success l-get-start">Get Started--Join!</a>
                    </div>
                </div>
                <Login />
            </div>
            <div className="l-comments row l-row">
                <div className="col-4">
                    <div className="l-user-comment">
                        <p>Twitter is on its way to becoming the next killer app.</p>
                    </div>
                    <p>TIME Magazine</p>
                </div>
                <div className="col-4">
                    <div className="l-user-comment">
                        It&apos;s almost like ESP
                    </div>
                    <p>Wired</p>
                </div>
                <div className="col-4">
                    <div className="l-user-comment">
                        <p>Twitter is the telegraph system of Web 2.0.</p>
                    </div>
                    <p><strong>Nicholas Carr</strong>, Author and Technologists</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage