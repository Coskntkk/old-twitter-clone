import { useState } from 'react';
import AuthRepository from '../../reposityory/AuthRepository';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [status, setStatus] = useState({
        success: null,
        message: ''
    });

    const sendForm = (e) => {
        e.preventDefault();
        AuthRepository.register(formData)
            .then(response => {
                if (response.data.success) {
                    setStatus({
                        success: true,
                        message: 'User created successfully, you can login now.'
                    });
                    // Set 
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
                    message: error.response.data.message || 'Something went wrong :('
                });
            })
            .finally(() => {
                setFormData({
                    username: '',
                    password: '',
                    email: ''
                });
            });
    };

    return (<div className={styles.container}>
        <div className="col-lg-8 col-md-12 r-register">
            <div>
                <h3 className="title"><strong>Create a Free Twitter Account</strong></h3>
            </div>
            {status.success !== null && <div className={`alert alert-${status.success === true ? 'success' : 'danger'}`}>
                {status.message}
            </div>}
            <div className="r-register-form">
                <form className="">
                    <div className="mb-3 row r-row">
                        <label htmlFor="signupUserName" className="col-sm-3 col-form-label">Username:</label>
                        <div className="col-sm-9 row r-row">
                            <div className="col-sm-9">
                                <input type="text" className="form-control r-formcontrol" id="signupUserName" name="user" autoComplete="off" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 row r-row">
                        <label htmlFor="signupPassword" className="col-sm-3 col-form-label">Password: </label>
                        <div className="col-sm-9 row r-row">
                            <div className="col-sm-9">
                                <input type="password" className="form-control r-formcontrol" id="signupPassword" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 row r-row">
                        <label htmlFor="signupEmail" className="col-sm-3 col-form-label">Email Address: </label>
                        <div className="col-sm-9 row r-row">
                            <div className="col-sm-9">
                                <input type="email" className="form-control r-formcontrol" id="signupEmail" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 row r-row">
                        <label htmlFor="humanness" className="col-sm-3 col-form-label">Humanness: </label>
                        <div className="col-sm-9">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="\images\capcha.png" className="img-fluid capcha" alt="capcha" />
                        </div>
                    </div>
                    <div className="mb-3 row r-row">
                        <label htmlFor="createAccount" className="col-sm-3 col-form-label"></label>
                        <div className="col-sm-9">
                            <button type="submit" className="btn btn-secondary r-btn" onClick={(e) => sendForm(e)}>I accept, Create my account.</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <Sidebar />
    </div>
    )
}

export default Register