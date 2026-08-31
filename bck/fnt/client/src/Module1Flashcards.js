import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Module1Flashcards.css'; // Using vanilla CSS

const Module1Flashcards = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showRitualModal, setShowRitualModal] = useState(false);

    const LANG_VOICE_MAP = {
        'Hindi': 'hi-IN',
        'English': 'en-US',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'Japanese': 'ja-JP'
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Default to Hindi since this is Module 1 (usually Hindi), but allow others
        utterance.lang = LANG_VOICE_MAP['Hindi'] || 'hi-IN';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:3000/api/courses/module1')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server Error: ${res.status}`);
                }
                return res.json();
            })
            .then((json) => {
                setData(json.content);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Module 1 Fetch Error:", err);
                setError(err.message + ". Please ensure the backend is running at http://localhost:3000");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="module1-container">Loading...</div>;
    if (error) return <div className="module1-container" style={{ color: 'red' }}>Error: {error}</div>;

    // Combine patterns and questions into flashcards
    const flashcards = [
        ...(data?.pattern?.examples?.map(ex => ({ front: ex.english, back: ex.hindi, type: 'Pattern Example' })) || []),
        ...(data?.questions?.map(q => ({ front: q.english, back: q.hindi, type: 'Question' })) || [])
    ];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
        }, 300); // Wait for un-flip animation
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 300);
    };

    const currentCard = flashcards[currentCardIndex];

    return (
        <div className="module1-container">
            <div className="module1-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/dashboard')} className="back-btn" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6366f1' }}>
                        ←
                    </button>
                    <div>
                        <h1 className="module1-title">
                            Hindi Module 1
                        </h1>
                        <p className="module1-description">{data?.pattern?.description}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowRitualModal(true)}
                    className="ritual-btn"
                >
                    Ritual ✨
                </button>
            </div>

            {flashcards.length > 0 && (
                <div className="flashcard-area">
                    <p className="card-type-label">
                        {currentCard.type} - {currentCardIndex + 1} / {flashcards.length}
                    </p>

                    <div
                        className="flashcard-wrapper"
                        onClick={() => {
                            const newFlipped = !isFlipped;
                            setIsFlipped(newFlipped);
                            if (newFlipped) {
                                speak(currentCard.back);
                            }
                        }}
                    >
                        {/* Flashcard inner container */}
                        <div
                            className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
                        >
                            {/* Front Side */}
                            <div className="flashcard-front">
                                <h2 className="flashcard-text-front">{currentCard.front}</h2>
                            </div>
                            {/* Back Side */}
                            <div className="flashcard-back">
                                <h2 className="flashcard-text-back">{currentCard.back}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="controls">
                        <button
                            onClick={handlePrev}
                            className="control-btn btn-prev"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="control-btn btn-next"
                        >
                            Next Pattern
                        </button>
                    </div>
                </div>
            )}

            {/* Ritual Modal */}
            {showRitualModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Daily Ritual</h3>
                        <div className="ritual-list">
                            {data?.ritualGreetings?.map((greeting, i) => (
                                <div key={i} className="ritual-item">
                                    <span className="ritual-hindi">{greeting.hindi}</span>
                                    <span className="ritual-english">{greeting.english}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowRitualModal(false)}
                            className="modal-close"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Module1Flashcards;
