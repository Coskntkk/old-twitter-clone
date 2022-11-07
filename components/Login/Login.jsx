import { useState } from 'react';
import AuthRepository from '../../reposityory/AuthRepository';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
const cookies = new Cookies();

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [status, setStatus] = useState({
        success: null,
        message: ''
    });
    const router = useRouter();
    const submitLogin = async (e) => {
        e.preventDefault();
        AuthRepository.login(formData)
            .then(response => {
                if (response.data.success) {
                    // Set cookie
                    cookies.set('token', response.data.token, { path: '/' });
                    router.push('/feed');
                } else {
                    setStatus({
                        success: false,
                        message: response.data.message
                    });
                }
            })
            .catch(error => {
                console.log(error);
                setStatus({
                    success: false,
                    message: "Something went wrong :("
                });
            });
    }
    return (
        <div className="col-lg-4 l-login">
            <a href='https://www.youtube.com/watch?v=1ouUrDZtMGM' type="button" className="btn btn-danger l-watch-a-video" target="_blank" rel="noreferrer"><i className="fas fa-play"></i> Watch a video!</a><br />
            <h4>Please sign in</h4>
            {status.success !== null && <div className={`alert alert-${status.success === true ? 'success' : 'danger'}`}>
                {status.message}
            </div>}
            <form className="" onSubmit={(e) => submitLogin(e)}>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label l-formLabel">username or email:</label>
                    <input type="text" className="form-control l-formControl" required rows="1" style={{ resize: "none" }} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label l-formLabel">password:</label>
                    <input type="password" className="form-control l-formControl" required rows="1" style={{ resize: "none" }} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /> 
                </div>
                <button type="button" className="btn btn-light l-sign-in-btn" onClick={(e) => submitLogin(e)}>Sign In &gt;&gt;</button> <br />
            </form>
            <p>Forgor password? <a href="#"><u>Click here.</u></a> </p>
            <div className="l-green-box">
                <p className="l-green-box-text">Already using Twitter by SMS or IM? <a href="#">Click here</a>.</p>
            </div>
        </div>
    )
}

export default Login