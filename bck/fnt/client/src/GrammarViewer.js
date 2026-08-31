import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GrammarViewer.css';

function GrammarViewer() {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const [grammarContent, setGrammarContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTopic, setCurrentTopic] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});

    const selectedCourseId = localStorage.getItem('selectedCourseId');

    useEffect(() => {
        async function fetchGrammar() {
            try {
                const res = await fetch(`http://localhost:3000/api/grammar/unit/${unitId}`);
                const data = await res.json();

                if (res.ok && data.grammar) {
                    setGrammarContent(data.grammar);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        if (unitId) {
            fetchGrammar();
        }
    }, [unitId]);

    if (loading) {
        return (
            <div className="grammar-loading">
                <div className="spinner"></div>
                <p>Loading grammar lesson...</p>
            </div>
        );
    }

    if (grammarContent.length === 0) {
        return (
            <div className="grammar-empty">
                <div className="empty-icon">📚</div>
                <h2>No Grammar Content</h2>
                <p>Grammar lessons for this unit are coming soon!</p>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const topic = grammarContent[currentTopic];

    const handleAnswerSelect = (exerciseIndex, answer) => {
        setUserAnswers({
            ...userAnswers,
            [exerciseIndex]: answer
        });
    };

    const checkAnswer = (exerciseIndex) => {
        return userAnswers[exerciseIndex] === topic.exercises[exerciseIndex].answer;
    };

    return (
        <div className="grammar-viewer-container">
            <div className="grammar-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>📖 Grammar Guide</h1>
            </div>

            <div className="grammar-content">
                <div className="topic-card">
                    <div className="topic-header">
                        <h2>{topic.title}</h2>
                        <div className="topic-progress">
                            {currentTopic + 1} / {grammarContent.length}
                        </div>
                    </div>

                    <div className="explanation-section">
                        <h3>📝 Explanation</h3>
                        <p>{topic.explanation}</p>
                    </div>

                    <div className="examples-section">
                        <h3>💡 Examples</h3>
                        <div className="examples-list">
                            {topic.examples.map((example, idx) => (
                                <div key={idx} className="example-item">
                                    <span className="example-icon">✓</span>
                                    <span>{example}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {topic.exercises && topic.exercises.length > 0 && (
                        <div className="exercises-section">
                            <h3>✍️ Practice Exercises</h3>
                            {topic.exercises.map((exercise, idx) => (
                                <div key={idx} className="exercise-item">
                                    <p className="exercise-question">{exercise.question}</p>
                                    <div className="exercise-options">
                                        {exercise.options.map((option, optIdx) => (
                                            <button
                                                key={optIdx}
                                                className={`option-btn ${userAnswers[idx] === option
                                                    ? checkAnswer(idx)
                                                        ? 'correct'
                                                        : 'incorrect'
                                                    : ''
                                                    }`}
                                                onClick={() => handleAnswerSelect(idx, option)}
                                                disabled={userAnswers[idx]}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {userAnswers[idx] && (
                                        <div className={`feedback ${checkAnswer(idx) ? 'correct' : 'incorrect'}`}>
                                            {checkAnswer(idx) ? '✅ Correct!' : `❌ Incorrect. The answer is: ${exercise.answer}`}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="navigation-buttons">
                        {currentTopic > 0 && (
                            <button className="btn-prev" onClick={() => {
                                setCurrentTopic(currentTopic - 1);
                                setUserAnswers({});
                            }}>
                                ← Previous Topic
                            </button>
                        )}
                        {currentTopic < grammarContent.length - 1 && (
                            <button className="btn-next" onClick={() => {
                                setCurrentTopic(currentTopic + 1);
                                setUserAnswers({});
                            }}>
                                Next Topic →
                            </button>
                        )}
                        {currentTopic === grammarContent.length - 1 && (
                            <button className="btn-finish" onClick={() => navigate('/dashboard')}>
                                ✓ Finish
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrammarViewer;
