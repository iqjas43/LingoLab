import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'learner'
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation: Allow only numbers and max 10 digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Specific Validation Checks
    if (!form.name.trim()) {
      setMessage('Please enter your full name.');
      return;
    }

    if (!form.email.trim()) {
      setMessage('Email address is required.');
      return;
    }

    if (!form.email.includes('@')) {
      setMessage('Invalid email address. It must contain "@".');
      return;
    }

    // Basic email regex for format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage('Please enter a valid email address (e.g., name@gmail.com).');
      return;
    }

    if (!form.phone.trim()) {
      setMessage('Phone number is required.');
      return;
    }

    if (form.phone.length !== 10) {
      setMessage('Phone number must be exactly 10 digits.');
      return;
    }

    if (!form.password) {
      setMessage('Password is required.');
      return;
    }

    if (form.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setMessage('Account created! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setIsLoading(false);
      setMessage('Error connecting to server. Please check your internet connection.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">

        {/* Left Side - Visual */}
        <div className="register-visual">
          <div className="visual-content">
            <span className="visual-icon">🌟</span>
            <h2>Join LingoLab</h2>
            <p>Start your journey to fluency today. Connect with learners worldwide.</p>
          </div>
          <div className="visual-overlay"></div>
        </div>

        {/* Right Side - Form */}
        <div className="register-form-section">
          <div className="form-header">
            <div className="logo-small">
              <div className="logo-box">L</div>
              <span>LingoLab</span>
            </div>
            <button className="login-nav-btn" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>

          <div className="form-body">
            <h1>Create Account</h1>
            <p className="subtitle">Sign up to get started.</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-field">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-field">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
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
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-field">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>I want to join as a:</label>
                <div className="select-field">
                  <span className="input-icon">🎓</span>
                  <select name="user_type" value={form.user_type} onChange={handleChange}>
                    <option value="learner">Learner</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              {message && <div className={`status-message ${message.includes('Error') || message.includes('failed') ? 'error' : 'success'}`}>
                {message}
              </div>}

              <button type="submit" className="btn-register" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
