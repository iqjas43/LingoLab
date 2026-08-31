import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import Lesson from './Lesson';
import ModuleView from './ModuleView';
import LanguageSetup from './LanguageSetup';
import Landing from './Landing';
import Quiz from './Quiz';
import Leaderboard from './Leaderboard';
import Profile from './Profile';
import Letters from './Letters';
import Layout from './Layout';
import GameLauncher from './GameLauncher';
import MatchingGame from './games/MatchingGame';
import FillInBlank from './games/FillInBlank';
import SentenceBuilder from './games/SentenceBuilder';
import Flashcards from './games/Flashcards';
import GrammarViewer from './GrammarViewer';
import Module1Flashcards from './Module1Flashcards';
import Library from './Library';
import Dictionary from './Dictionary';
import Phrases from './Phrases';
import RewardsShop from './RewardsShop';

const maskEmail = (value) => {
  if (!value) return '';
  const [name, domain] = value.split('@');
  if (!domain) return value;
  if (name.length <= 3) return value[0] + '***@' + domain;
  const visible = name.slice(0, 3);
  return `${visible}***@${domain}`;
};

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');

  if (!token || !email) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Navbar() {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <div
      style={{
        backgroundColor: '#181a1f',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Link
          to="/dashboard"
          style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Language Learning App
        </Link>
      </div>

      {token && email && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px' }}>Logged in as {maskEmail(email)}</span>

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e06c75',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/language-setup" element={<PrivateRoute><LanguageSetup /></PrivateRoute>} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/teacher-dashboard" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/letters" element={<PrivateRoute><Letters /></PrivateRoute>} />
          <Route path="/lesson/:lessonId" element={<PrivateRoute><Lesson /></PrivateRoute>} />
          <Route path="/module-view/:moduleId" element={<PrivateRoute><ModuleView /></PrivateRoute>} />
          <Route path="/quiz/:lessonId" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
          <Route path="/dictionary" element={<PrivateRoute><Dictionary /></PrivateRoute>} />
          <Route path="/phrases" element={<PrivateRoute><Phrases /></PrivateRoute>} />
          <Route path="/rewards" element={<PrivateRoute><RewardsShop /></PrivateRoute>} />

          {/* Game Routes moved inside Layout for context and consistency */}
          <Route path="/games" element={<PrivateRoute><GameLauncher /></PrivateRoute>} />
          <Route path="/games/matching" element={<PrivateRoute><MatchingGame /></PrivateRoute>} />
          <Route path="/games/fill-blank" element={<PrivateRoute><FillInBlank /></PrivateRoute>} />
          <Route path="/games/sentence" element={<PrivateRoute><SentenceBuilder /></PrivateRoute>} />
          <Route path="/games/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
        </Route>

        {/* Grammar Route */}
        <Route path="/grammar/:unitId" element={<PrivateRoute><GrammarViewer /></PrivateRoute>} />

        {/* Module 1 Custom Route */}
        <Route path="/module1" element={<PrivateRoute><Module1Flashcards /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
