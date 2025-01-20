import React, { useContext, useState } from 'react'
import './Signin.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext.js'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';

function Signin() {
    const { t } = useTranslation();
    const [isStudent, setIsStudent] = useState(true)
    const [admissionId, setAdmissionId] = useState()
    const [employeeId,setEmployeeId] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")
    const { dispatch } = useContext(AuthContext)

    const API_URL = process.env.REACT_APP_API_URL
    // const API_URL = "http://localhost:3001/"
    
    const loginCall = async (userCredential, dispatch) => {
        console.log("hello");
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(API_URL+"api/auth/signin", userCredential);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            console.log(res);
        }
        catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err })
            // setError("Wrong Password Or Username")
            setError("Wrong Password Or Username");
        }
    }

    const handleForm = (e) => {
        e.preventDefault()
        isStudent
        ? loginCall({ admissionId, password }, dispatch)
        : loginCall({ employeeId,password }, dispatch)
    }

    return (
        <div className='signin-container'>
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
                        <input className='signin-textbox' type="text" placeholder={isStudent ? t('signin.enterStudentID') : t('signin.enterstaffID')} name={isStudent?"admissionId":"employeeId"} required onChange={(e) => { isStudent?setAdmissionId(e.target.value):setEmployeeId(e.target.value) }}/>
                        <label htmlFor="password"><b>{t('signin.password')}</b></label>
                        <input className='signin-textbox' type="password" minLength='6' placeholder={t('signin.enterPassword')} name="psw" required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                    <button className="signin-button">{t('signin.title')}</button>
                    <a className="forget-pass" href="#home">{t('signin.forgotPassword')}</a>
                </form>
                <div className='signup-option'>
                    <p className="signup-question">{t('signin.noAccount')}</p>
                </div>
            </div>
        </div>
    )
}

export default Signin