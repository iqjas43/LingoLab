import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const LANG_FLAGS = {
    'Hindi': '🇮🇳',
    'English': '🇺🇸',
    'Spanish': '🇪🇸',
    'French': '🇫🇷',
    'Japanese': '🇯🇵'
};

const LANG_ICONS = {
    'Hindi': 'अ',
    'English': 'Aa',
    'Spanish': 'Ñ',
    'French': 'Ç',
    'German': 'Ä',
    'Japanese': 'あ'
};

const LETTERS_DATA = {
    'Hindi': ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ'],
    'English': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    'Spanish': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ñ'],
    'French': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ç'],
    'German': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'Ä', 'Ö', 'Ü'],
    'Japanese': ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た'],
};

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userType') || 'learner';

    const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true); // Can handle loading locally or pass down
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(localStorage.getItem('selectedCourseId') || '');

    // Fetch Data (Hoisted from Dashboard)
    const fetchUser = async () => {
        if (!email) return;
        try {
            const userRes = await fetch(`http://localhost:3000/api/auth/me?email=${email}&t=${Date.now()}`);
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Data (Hoisted from Dashboard)
    useEffect(() => {
        async function loadData() {
            if (!email) return;
            try {
                fetchUser();
                const coursesRes = await fetch('http://localhost:3000/api/courses');
                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    setCourses(coursesData);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, [email]);

    const handleCourseChange = (e) => {
        const newId = e.target.value;
        setSelectedCourseId(newId);
        localStorage.setItem('selectedCourseId', newId);
    };

    const currentCourse = courses.find(c => c.courseId === Number(selectedCourseId));
    const currentLangIcon = currentCourse ? LANG_ICONS[currentCourse.language] : 'L';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon-sm" style={{ fontSize: '18px' }}>{currentLangIcon || 'L'}</div>
                    <span>LingoLab</span>
                </div>

                <nav className="sidebar-nav">
                    {userRole === 'teacher' ? (
                        <>
                            <button
                                className={`nav-item ${location.pathname === '/teacher-dashboard' ? 'active' : ''}`}
                                onClick={() => navigate('/teacher-dashboard')}
                            >
                                <span>🏠</span> Teacher Dashboard
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
                                onClick={() => navigate('/profile')}
                            >
                                <span>👤</span> Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                onClick={() => navigate('/dashboard')}
                            >
                                <span>🏠</span> Dashboard
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/leaderboard' ? 'active' : ''}`}
                                onClick={() => navigate('/leaderboard')}
                            >
                                <span>🏆</span> Leaderboard
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
                                onClick={() => navigate('/profile')}
                            >
                                <span>👤</span> Profile
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/letters' ? 'active' : ''}`}
                                onClick={() => navigate('/letters')}
                            >
                                <span>🔤</span> Letters
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/games' ? 'active' : ''}`}
                                onClick={() => navigate('/games')}
                            >
                                <span>🎮</span> Games
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/library' ? 'active' : ''}`}
                                onClick={() => navigate('/library')}
                            >
                                <span>📚</span> Library
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/dictionary' ? 'active' : ''}`}
                                onClick={() => navigate('/dictionary')}
                            >
                                <span>📖</span> Dictionary
                            </button>
                            <button
                                className={`nav-item ${location.pathname === '/phrases' ? 'active' : ''}`}
                                onClick={() => navigate('/phrases')}
                            >
                                <span>💡</span> Phrases
                            </button>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    {/* Show tiny active course indicator only for learners */}
                    {userRole !== 'teacher' && currentCourse && (
                        <div style={{ marginBottom: '15px', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>{LANG_FLAGS[currentCourse.language]}</span>
                            <span>Learning: <strong>{currentCourse.language}</strong></span>
                        </div>
                    )}
                    <button className="logout-btn" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                { /* Pass state down to children (Dashboard, etc.) */}
                <Outlet context={{ user, setUser, fetchUser, courses, selectedCourseId, handleCourseChange, currentCourse }} />
            </main>
        </div>
    );
}

export default Layout;
