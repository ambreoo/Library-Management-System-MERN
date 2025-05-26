import React, { useContext, useState } from 'react'
import './Signin.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext.js'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { useHistory } from 'react-router-dom';

function Signin() {
    const { t } = useTranslation();
    const [isStudent, setIsStudent] = useState(true)
    const [admissionId, setAdmissionId] = useState()
    const [employeeId,setEmployeeId] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")
    const [resetPasswordId, setResetPasswordId] = useState("")
    const { dispatch } = useContext(AuthContext)

    const API_URL = process.env.REACT_APP_API_URL

    const history = useHistory();
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const res = await axios.post(API_URL + 'api/auth/google', { token });
            const user = res.data;

            // Check if profile is incomplete
            if (!user.isComplete) {
                dispatch({ type: "LOGIN_SUCCESS", payload: user });
                localStorage.setItem("user", JSON.stringify(user));
                history.push('/complete-profile', { user });
            } else {
                dispatch({ type: "LOGIN_SUCCESS", payload: user });
                localStorage.setItem("user", JSON.stringify(user));
                history.push('/dashboard@member');
            }              
        } catch (err) {
            console.error("Google login failed", err);
            setError("Google login failed.");
        }
    };   
    
    const loginCall = async (userCredential, dispatch) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(API_URL+"api/auth/signin", userCredential);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            console.log(res);
        }
        catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err })
            setError("Wrong Password Or Username");
        }
    }

    const handleForm = (e) => {
        e.preventDefault()
        isStudent
        ? loginCall({ admissionId, password }, dispatch)
        : loginCall({ employeeId,password }, dispatch)
    }

    // Handle Forgot Password logic
    const handleForgotPassword = async () => {
        try {
            if (!resetPasswordId) {
                alert("Please enter your ID.");
                return;
            }

            // Send request to backend to initiate password reset
            await axios.post(API_URL+"api/auth/forgot-password", {
                admissionId: isStudent ? resetPasswordId : undefined,
                employeeId: !isStudent ? resetPasswordId : undefined,
            });
    
            alert("Password reset link sent to your registered email.");
        } catch (err) {
            alert("Error sending reset link.");
        }
    };    

    return (
        <div className='signin-container' style={{ background: "url('/school_picture4.jpg') no-repeat center center/cover" }}>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title">{t('signin.title')}</h2>
                    <p className="line"></p>
                    <div className="persontype-question">
                        <p>{t('signin.question')}</p>
                        <Switch
                            onChange={() => setIsStudent(!isStudent)}
                            color="primary"
                        />
                    </div>
                    <div className="error-message"><p>{error}</p></div>
                    <div className="signin-fields">
                        <label htmlFor={isStudent?"admissionId":"employeeId"}> <b>{isStudent ? t('signin.studentID') : t('signin.staffID')}</b></label>
                        <input
                            className='signin-textbox'
                            type="text"
                            placeholder={isStudent ? t('signin.enterStudentID') : t('signin.enterStaffID')}
                            name={isStudent ? "admissionId" : "employeeId"}
                            required
                            onChange={(e) => {
                            const value = e.target.value;
                            isStudent ? setAdmissionId(value) : setEmployeeId(value);
                            setResetPasswordId(value);
                            }}
                            />
                        <label htmlFor="password"><b>{t('signin.password')}</b></label>
                        <input className='signin-textbox' type="password" minLength='6' placeholder={t('signin.enterPassword')} name="psw" required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                    <button className="signin-button">{t('signin.title')}</button>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError("Google login failed.")}
                        useOneTap
                    />   
                    <a className="forget-pass" onClick={handleForgotPassword}>{t('signin.forgotPassword')}</a>             
                </form>
                <div className='signup-option'>
                    <p className="signup-question">{t('signin.noAccount')}</p>
                </div>
            </div>
        </div>
    )
}

export default Signin