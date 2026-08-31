import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import './Dashboard.css'; // Reusing dashboard styles for modules

function ModuleView() {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { courses, selectedCourseId, user } = useOutletContext();

    const [moduleData, setModuleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courses.length > 0 && selectedCourseId) {
            const course = courses.find(c => c.courseId === Number(selectedCourseId));
            if (course && course.levels) {
                // Find the module in the levels
                let found = null;
                for (const lvl of course.levels) {
                    const mod = lvl.modules.find(m => String(m._id) === String(moduleId));
                    if (mod) {
                        found = mod;
                        break;
                    }
                }
                setModuleData(found);
            }
            setLoading(false);
        }
    }, [courses, selectedCourseId, moduleId]);

    if (loading) return <div className="loading-screen">Loading Chapter...</div>;

    if (!moduleData) {
        return (
            <div className="error-screen">
                <div style={{ textAlign: 'center' }}>
                    <h2>Chapter Not Found</h2>
                    <p>We couldn't find the content for this chapter.</p>
                    <button className="btn-start" style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const themeColor = moduleData.isCheckpoint ? '#ef4444' : '#4f46e5';

    return (
        <div className="dashboard-content-wrapper" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header Area */}
            <div className="lesson-header" style={{ background: themeColor, padding: '40px', borderRadius: '0 0 40px 40px', color: 'white', textAlign: 'center', boxShadow: '0 10px 30px -10px ' + themeColor }}>
                <h4 style={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', marginBottom: '10px' }}>CHAPTER OVERVIEW</h4>
                <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>{moduleData.title}</h1>
                <p style={{ fontSize: '18px', opacity: 0.9 }}>{moduleData.description}</p>
            </div>

            <div className="dashboard-content" style={{ marginTop: '20px' }}>
                <h2 className="section-title">Lessons in this Chapter</h2>

                <div className="learning-path">
                    {moduleData.lessons && moduleData.lessons.length > 0 ? (
                        moduleData.lessons.map((lesson, index) => {

                            // Simplistic unlock logic: assume available if prior is clicked, or just leave all unlocked for now.
                            // A fuller implementation would check UserProgress for completed lessons.
                            const isLocked = false;

                            return (
                                <div
                                    key={lesson._id}
                                    className={`unit-card ${isLocked ? 'locked' : ''}`}
                                    style={{ '--unit-color': themeColor }}
                                >
                                    <div className="unit-header" style={{ backgroundColor: themeColor }}>
                                        <span className="unit-number">LESSON {index + 1}</span>
                                    </div>
                                    <div className="unit-body">
                                        <h3>{lesson.title}</h3>
                                        <p>{lesson.type === 'Vocab' ? 'Vocabulary Practice' : lesson.type === 'Grammar' ? 'Grammar Lesson' : 'Practice Lesson'}</p>

                                        <div className="unit-actions">
                                            <button
                                                className="btn-start"
                                                onClick={() => navigate(`/lesson/${lesson._id}`)}
                                            >
                                                START
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state" style={{ padding: '40px', background: 'white', borderRadius: '20px', textAlign: 'center' }}>
                            <h3>No lessons available yet</h3>
                            <p style={{ color: '#64748b' }}>Check back later for updates to this chapter.</p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '40px', justifyContent: 'center' }}>
                    <button
                        className="btn-secondary large"
                        onClick={() => navigate('/dashboard')}
                        style={{ padding: '16px 32px', fontSize: '18px', background: '#e2e8f0', color: '#1e293b', border: 'none' }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModuleView;
