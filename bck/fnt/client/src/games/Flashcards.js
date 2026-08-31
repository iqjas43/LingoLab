import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './Flashcards.css';
import { speak as globalSpeak } from '../utils/speechUtils';

// LANG_TTS_MAP moved to speechUtils.js

const FLASHCARDS_DATA = {
    'Hindi': [
        { id: 1, front: 'Namaste', back: 'Hello' },
        { id: 2, front: 'Paani', back: 'Water' },
        { id: 3, front: 'Ghar', back: 'Home' },
        { id: 4, front: 'Dost', back: 'Friend' },
        { id: 5, front: 'Kitab', back: 'Book' },
        { id: 6, front: 'Khush', back: 'Happy' },
        { id: 7, front: 'Kripaya', back: 'Please' },
        { id: 8, front: 'Maza', back: 'Fun' }
    ],
    'English': [
        { id: 1, front: 'Apple', back: 'सेब (Seb)' },
        { id: 2, front: 'Boy', back: 'लड़का (Ladka)' },
        { id: 3, front: 'Cat', back: 'बिल्ली (Billi)' },
        { id: 4, front: 'Dog', back: 'कुत्ता (Kutta)' },
        { id: 5, front: 'Egg', back: 'अंडा (Anda)' },
        { id: 6, front: 'Sun', back: 'सूरज (Suraj)' },
        { id: 7, front: 'Rain', back: 'बारिश (Baarish)' },
        { id: 8, front: 'Flower', back: 'फूल (Phool)' }
    ],
    'Spanish': [
        { id: 1, front: 'Hola', back: 'Hello' },
        { id: 2, front: 'Agua', back: 'Water' },
        { id: 3, front: 'Casa', back: 'House' },
        { id: 4, front: 'Amigo', back: 'Friend' },
        { id: 5, front: 'Libro', back: 'Book' },
        { id: 6, front: 'Feliz', back: 'Happy' },
        { id: 7, front: 'Sol', back: 'Sun' },
        { id: 8, front: 'Luna', back: 'Moon' }
    ],
    'French': [
        { id: 1, front: 'Bonjour', back: 'Hello' },
        { id: 2, front: 'Eau', back: 'Water' },
        { id: 3, front: 'Maison', back: 'House' },
        { id: 4, front: 'Ami', back: 'Friend' },
        { id: 5, front: 'Livre', back: 'Book' },
        { id: 6, front: 'Heureux', back: 'Happy' },
        { id: 7, front: 'Ciel', back: 'Sky' },
        { id: 8, front: 'Fleur', back: 'Flower' }
    ],
    'Japanese': [
        { id: 1, front: 'こんにちは (Konnichiwa)', back: 'Hello' },
        { id: 2, front: 'みず (Mizu)', back: 'Water' },
        { id: 3, front: 'いえ (Ie)', back: 'House' },
        { id: 4, front: 'ともだち (Tomodachi)', back: 'Friend' },
        { id: 5, front: 'ほん (Hon)', back: 'Book' },
        { id: 6, front: 'うれしい (Ureshii)', back: 'Happy' },
        { id: 7, front: 'ねこ (Neko)', back: 'Cat' },
        { id: 8, front: 'いぬ (Inu)', back: 'Dog' }
    ]
};

function Flashcards() {
    const navigate = useNavigate();
    const { user, currentCourse } = useOutletContext();
    const [cards, setCards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState([]);
    const [reviewCards, setReviewCards] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const langName = currentCourse?.language || 'Hindi';
    const currentPool = FLASHCARDS_DATA[langName] || FLASHCARDS_DATA['Hindi'];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateCards = () => {
        return shuffleArray(currentPool).slice(0, 10);
    };

    useEffect(() => {
        setCards(generateCards());
    }, [langName]);

    const speak = useCallback((text) => {
        globalSpeak(text, langName, 0.85);
    }, [langName]);

    const card = cards.length > 0 ? cards[currentCard] : null;

    const handleKnow = () => {
        const isAlreadyKnown = knownCards.includes(card.id);
        if (!isAlreadyKnown) {
            setKnownCards([...knownCards, card.id]);
        }
        nextCard(!isAlreadyKnown);
    };

    const handleReview = () => {
        if (!reviewCards.includes(card.id)) {
            setReviewCards([...reviewCards, card.id]);
        }
        nextCard(false);
    };

    const nextCard = (isLastKnown = false) => {
        setFlipped(false);
        const currentKnownCount = knownCards.length + (isLastKnown ? 1 : 0);

        if (currentCard + 1 < cards.length) {
            setTimeout(() => setCurrentCard(currentCard + 1), 300);
        } else {
            // Use the calculated count to avoid stale state issues
            setTimeout(() => finishGame(currentKnownCount * 5), 300);
        }
    };

    const finishGame = async (finalScore) => {
        setGameOver(true);
        if (user && user.email) {
            setIsSaving(true);
            try {
                await fetch('http://localhost:3000/api/auth/game-played', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        xpEarned: finalScore
                    })
                });
            } catch (err) {
                console.error("Failed to save XP:", err);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const restartGame = () => {
        setCards(generateCards());
        setCurrentCard(0);
        setFlipped(false);
        setKnownCards([]);
        setReviewCards([]);
        setGameOver(false);
        setIsSaving(false);
    };

    return (
        <div className="flashcards-container">
            <div className="game-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>🃏 Flashcard Review</h1>
                <div className="game-stats">
                    <div className="stat">📚 {currentCard + 1}/{cards.length}</div>
                    <div className="stat-group">
                        <div className="mini-stat">✅ {knownCards.length}</div>
                        <div className="mini-stat">📖 {reviewCards.length}</div>
                    </div>
                </div>
            </div>

            {!gameOver ? (
                <div className="flashcard-view">
                    {!card ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => {
                                setFlipped(!flipped);
                                if (!flipped) speak(card.front);
                            }}>
                                <div className="flashcard-front">
                                    <div className="card-label">{langName}</div>
                                    <div className="card-word">{card.front}</div>
                                    <div className="tap-hint">Tap to flip</div>
                                </div>
                                <div className="flashcard-back">
                                    <div className="card-label">{langName === 'English' ? 'Hindi' : 'English'}</div>
                                    <div className="card-word">{card.back}</div>
                                    <div className="tap-hint">Tap to flip back</div>
                                </div>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentCard + 1) / (cards.length || 1)) * 100}%` }}
                                ></div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-review" onClick={handleReview}>
                                    📖 Need Review
                                </button>
                                <button className="btn-know" onClick={handleKnow}>
                                    ✅ I Know This
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="game-over-screen">
                    <div className="game-over-card">
                        <h2>📊 Review Complete!</h2>

                        <div className="summary-stats">
                            <div className="summary-item">
                                <div className="summary-icon">✅</div>
                                <div className="summary-label">Known</div>
                                <div className="summary-value">{knownCards.length}</div>
                            </div>
                            <div className="summary-item">
                                <div className="summary-icon">📖</div>
                                <div className="summary-label">Review</div>
                                <div className="summary-value">{reviewCards.length}</div>
                            </div>
                            {isSaving && <div className="saving-status">💾 Saving XP...</div>}
                            <div className="summary-item">
                                <div className="summary-icon">📚</div>
                                <div className="summary-label">Total</div>
                                <div className="summary-value">{cards.length}</div>
                            </div>
                        </div>

                        <div className="game-over-actions">
                            <button className="btn-restart" onClick={restartGame}>
                                🔄 Review Again
                            </button>
                            <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
                                🏠 Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Flashcards;
