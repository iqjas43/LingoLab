
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing Login styles

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPhone(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email.trim()) {
            setError('Email address is required.');
            return;
        }

        if (!email.includes('@')) {
            setError('Invalid email address. It must contain "@".');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address (e.g., name@gmail.com).');
            return;
        }

        if (!phone.trim()) {
            setError('Phone number is required.');
            return;
        }

        if (phone.length !== 10) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to reset password');
                setLoading(false);
                return;
            }

            setMessage(data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError('Server connection failed. Please check your internet connection.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper" style={{ justifyContent: 'center' }}>
                <div className="login-form-section" style={{ maxWidth: '450px', width: '100%', padding: '0 20px' }}>
                    <div className="form-header">
                        <div className="logo-small" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <div className="logo-box">L</div>
                            <span>LingoLab</span>
                        </div>
                    </div>

                    <div className="form-body">
                        <h1>Reset Password</h1>
                        <p className="subtitle">Verify your identity to set a new password</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-field">
                                    <span className="input-icon">✉️</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@gmail.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Phone Number</label>
                                <div className="input-field">
                                    <span className="input-icon">📱</span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Your registered phone number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>New Password</label>
                                <div className="input-field">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Confirm Password</label>
                                <div className="input-field">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>

                            {message && <div style={{ color: 'green', marginBottom: '15px', padding: '10px', background: '#dcfce7', borderRadius: '8px' }}>✅ {message}</div>}
                            {error && <div className="error-message">⚠️ {error}</div>}

                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            <div className="register-link">
                                Remembered? <span onClick={() => navigate('/login')}>Sign In</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
