import React, { useState, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import './CompleteProfile.css';

function CompleteProfile() {
  const { state } = useLocation();
  const history = useHistory();
  const user = state?.user;
  const { dispatch } = useContext(AuthContext);
  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');
  const [admissionId, setAdmissionId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}api/auth/complete-profile`, {
        userId: user._id,
        userType,
        password,
        admissionId: userType === 'Student' ? admissionId : undefined,
        employeeId: userType === 'Staff' ? employeeId : undefined,
      });
  
      const updatedUser = res.data;
  
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      history.push('/dashboard@member');
    } catch (err) {
      console.error(err);
      setError('Failed to complete profile.');
    }
  };  
  if (!user) {
    return (
      <div className="image-container">
        <img className="d-block w-100" src="/school_picture4.jpg" alt="Background" />
        <div className="image-overlay"></div>
        <div className="complete-profile-container">
          <div className="complete-profile-card">
            <h2>User session missing</h2>
            <p>Please log in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-image-container">
      <img className="d-block w-100" src="/school_picture4.jpg" alt="Background" />
      <div className="cp-image-overlay"></div>

      <div className="cp-container">
        <div className="cp-card">
          <h2 className="cp-title">Complete Your Profile</h2>
          {error && <div className="cp-error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="cp-input-field">
              <label>User Type</label>
              <select className="cp-input" value={userType} onChange={e => setUserType(e.target.value)} required>
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {userType === 'Student' && (
              <div className="cp-input-field">
                <label>Student ID</label>
                <input className="cp-input" type="text" value={admissionId} onChange={e => setAdmissionId(e.target.value)} required />
              </div>
            )}

            {userType === 'Staff' && (
              <div className="cp-input-field">
                <label>Staff ID</label>
                <input className="cp-input" type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
              </div>
            )}

            <div className="cp-input-field">
              <label>Password</label>
              <input className="cp-input" type="password" minLength="6" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="cp-button-container">
              <button className="cp-button" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
