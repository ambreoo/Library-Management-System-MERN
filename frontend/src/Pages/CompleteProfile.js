import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import './CompleteProfile.css';

function CompleteProfile() {
  const { state } = useLocation();
  const history = useHistory();
  const user = state?.user;

  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');
  const [admissionId, setAdmissionId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}api/auth/complete-profile`, {
        userId: user._id,
        userType,
        password,
        admissionId: userType === 'student' ? admissionId : undefined,
        employeeId: userType === 'staff' ? employeeId : undefined,
      });

      history.push(userType === 'admin' ? '/dashboard@admin' : '/dashboard@' + userType);
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
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {userType === 'student' && (
              <div className="cp-input-field">
                <label>Student ID</label>
                <input className="cp-input" type="text" value={admissionId} onChange={e => setAdmissionId(e.target.value)} required />
              </div>
            )}

            {userType === 'staff' && (
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
