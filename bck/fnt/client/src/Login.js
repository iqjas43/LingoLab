import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];

const TRANSLATIONS = {
  English: {
    welcome: "Welcome Back!",
    welcomeSub: "Ready to continue your language journey? Your streak is waiting for you.",
    loginTitle: "Log in",
    loginSub: "Enter your details to access your account.",
    emailLabel: "Email Address",
    emailPlaceholder: "name@gmail.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPass: "Forgot password?",
    signIn: "Sign In",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    maintenance: "is under maintenance 🛠️",
    serverError: "Server connection failed. Please try again.",
    invalidCreds: "Invalid credentials"
  },
  Hindi: {
    welcome: "स्वागत है!",
    welcomeSub: "अपनी भाषा यात्रा जारी रखने के लिए तैयार हैं? आपका स्ट्रीक आपका इंतज़ार कर रहा है।",
    loginTitle: "लॉग इन करें",
    loginSub: "अपने खाते तक पहुंचने के लिए अपना विवरण दर्ज करें।",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "name@gmail.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPass: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    loggingIn: "लॉग इन हो रहा है...",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें",
    maintenance: "मरम्मत चल रही है 🛠️",
    serverError: "सर्वर कनेक्शन विफल। पुन: प्रयास करें।",
    invalidCreds: "अमान्य क्रेडेंशियल्स"
  }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');
  const [langOpen, setLangOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [langMsg, setLangMsg] = useState(''); // State for language maintenance message

  const navigate = useNavigate();

  // Get current translations
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.English;

  const handleLangSelect = (lang) => {
    if (lang === 'English' || lang === 'Hindi') {
      setSelectedLang(lang);
      setLangMsg('');
      setLangOpen(false);
    } else {
      setLangMsg(`${lang} ${t.maintenance}`);
      // Clear message after 3 seconds
      setTimeout(() => setLangMsg(''), 3000);
      setLangOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || t.invalidCreds);
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', data.token || 'dummy-token');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userType', data.user_type || 'learner');

      // Animation delay for smoother UX
      setTimeout(() => {
        if (data.user_type === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setMessage(t.serverError);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">

        {/* Left Side - Visual */}
        <div className="login-visual">
          <div className="visual-content">
            <span className="visual-icon">🚀</span>
            <h2>{t.welcome}</h2>
            <p>{t.welcomeSub}</p>
          </div>
          <div className="visual-overlay"></div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="form-header">
            <div className="logo-small">
              <div className="logo-box">L</div>
              <span>LingoLab</span>
            </div>

            <div className="lang-dropdown">
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                🌐 {selectedLang}
              </button>
              {langOpen && (
                <div className="lang-menu">
                  {LANGUAGES.map(lang => (
                    <div key={lang} className="lang-item" onClick={() => handleLangSelect(lang)}>
                      {lang}
                    </div>
                  ))}
                </div>
              )}
              {langMsg && <div className="lang-toast">{langMsg}</div>}
            </div>
          </div>

          <div className="form-body">
            <h1>{t.loginTitle}</h1>
            <p className="subtitle">{t.loginSub}</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>{t.emailLabel}</label>
                <div className="input-field">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>{t.passwordLabel}</label>
                <div className="input-field">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  {t.rememberMe}
                </label>
                <span onClick={() => navigate('/forgot-password')} className="forgot-password" style={{ cursor: 'pointer' }}>
                  {t.forgotPass}
                </span>
              </div>

              {message && <div className="error-message">⚠️ {message}</div>}

              <button type="submit" className="btn-login" disabled={isLoading}>
                {isLoading ? t.loggingIn : t.signIn}
              </button>

              <div className="register-link">
                {t.noAccount} <span onClick={() => navigate('/register')}>{t.signUp}</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
