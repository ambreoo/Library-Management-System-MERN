import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import './ResetPassword.css'; // Assuming you have a CSS file for styling

function ResetPassword() {
    const location = useLocation(); // To access the URL query
    const history = useHistory(); // To redirect after success
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Extract token from the URL query
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token'); // Get token from URL

    // Handle password reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Make a request to the backend to reset the password
            const response = await axios.post(`https://cusv-library.onrender.com/api/auth/reset-password`, {
                token,
                newPassword
            });

            // Handle success
            if (response.status === 200) {
                setError('');
                alert("Password reset successful.");
                history.push('/signin'); // Redirect to Sign In page after success
            }
        } catch (err) {
            setLoading(false);
            setError("There was an error resetting your password. Please try again.");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Reset Your Password</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handlePasswordReset}>
                    <div className="input-field-reset">
                        <label htmlFor="newPassword">New Password</label>
                        <input className="input-reset"
                            type="password"
                            id="newPassword"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-field-reset">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input className="input-reset"
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="reset-password-button" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
