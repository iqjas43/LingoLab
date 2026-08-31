import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './MatchingGame.css';

const LANG_TTS_MAP = {
    'Hindi': { original: 'hi-IN', translation: 'en-US' },
    'English': { original: 'en-US', translation: 'hi-IN' },
    'Spanish': { original: 'es-ES', translation: 'en-US' },
    'French': { original: 'fr-FR', translation: 'en-US' },
    'Japanese': { original: 'ja-JP', translation: 'en-US' }
};

const MATCHING_DATA = {
    'Hindi': [
        { id: 1, original: 'Namaste', translation: 'Hello' },
        { id: 2, original: 'Paani', translation: 'Water' },
        { id: 3, original: 'Ghar', translation: 'Home' },
        { id: 4, original: 'Dost', translation: 'Friend' },
        { id: 5, original: 'Kitab', translation: 'Book' },
        { id: 6, original: 'Khush', translation: 'Happy' },
        { id: 7, original: 'Aam', translation: 'Mango' },
        { id: 8, original: 'Suvichaar', translation: 'Good Thought' }
    ],
    'English': [
        { id: 1, original: 'Apple', translation: 'सेब (Seb)' },
        { id: 2, original: 'Boy', translation: 'लड़का (Ladka)' },
        { id: 3, original: 'Cat', translation: 'बिल्ली (Billi)' },
        { id: 4, original: 'Dog', translation: 'कुत्ता (Kutta)' },
        { id: 5, original: 'Egg', translation: 'अंडा (Anda)' },
        { id: 6, original: 'Fish', translation: 'मछली (Machhli)' },
        { id: 7, original: 'Girl', translation: 'लड़की (Ladki)' },
        { id: 8, original: 'Home', translation: 'घर (Ghar)' }
    ],
    'Spanish': [
        { id: 1, original: 'Hola', translation: 'Hello' },
        { id: 2, original: 'Agua', translation: 'Water' },
        { id: 3, original: 'Casa', translation: 'House' },
        { id: 4, original: 'Amigo', translation: 'Friend' },
        { id: 5, original: 'Libro', translation: 'Book' },
        { id: 6, original: 'Feliz', translation: 'Happy' },
        { id: 7, original: 'Sol', translation: 'Sun' },
        { id: 8, original: 'Luna', translation: 'Moon' }
    ],
    'French': [
        { id: 1, original: 'Bonjour', translation: 'Hello' },
        { id: 2, original: 'Eau', translation: 'Water' },
        { id: 3, original: 'Maison', translation: 'House' },
        { id: 4, original: 'Ami', translation: 'Friend' },
        { id: 5, original: 'Livre', translation: 'Book' },
        { id: 6, original: 'Heureux', translation: 'Happy' },
        { id: 7, original: 'Ciel', translation: 'Sky' },
        { id: 8, original: 'Fleur', translation: 'Flower' }
    ],
    'Japanese': [
        { id: 1, original: 'こんにちは (Konnichiwa)', translation: 'Hello' },
        { id: 2, original: 'みず (Mizu)', translation: 'Water' },
        { id: 3, original: 'いえ (Ie)', translation: 'House' },
        { id: 4, original: 'ともだち (Tomodachi)', translation: 'Friend' },
        { id: 5, original: 'ほん (Hon)', translation: 'Book' },
        { id: 6, original: 'うれしい (Ureshii)', translation: 'Happy' },
        { id: 7, original: 'ねこ (Neko)', translation: 'Cat' },
        { id: 8, original: 'いぬ (Inu)', translation: 'Dog' }
    ]
};

function MatchingGame() {
    const navigate = useNavigate();
    const { user, currentCourse } = useOutletContext();
    const [words, setWords] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const langName = currentCourse?.language || 'Hindi';
    const currentPool = MATCHING_DATA[langName] || MATCHING_DATA['Hindi'];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateGameData = () => {
        // Pick 6 random words from the pool
        const shuffledPool = shuffleArray(currentPool);
        const selectedSubset = shuffledPool.slice(0, 6);

        const cards = [];
        selectedSubset.forEach(word => {
            cards.push({ ...word, type: 'original', cardId: `${word.id}-orig` });
            cards.push({ ...word, type: 'translation', cardId: `${word.id}-trans` });
        });
        return shuffleArray(cards);
    };

    useEffect(() => {
        setWords(generateGameData());
    }, [langName]);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    const speak = (text, type) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = LANG_TTS_MAP[langName] || LANG_TTS_MAP['Hindi'];
        utterance.lang = type === 'original' ? voices.original : voices.translation;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleCardClick = (card) => {
        if (gameOver || matchedPairs.includes(card.id) || selectedCards.length >= 2) return;
        if (selectedCards.find(c => c.cardId === card.cardId)) return;

        // Play voice for the clicked card
        speak(card.type === 'original' ? card.original : card.translation, card.type);

        const newSelected = [...selectedCards, card];
        setSelectedCards(newSelected);

        if (newSelected.length === 2) {
            // Check for match
            if (newSelected[0].id === newSelected[1].id && newSelected[0].type !== newSelected[1].type) {
                // Match!
                setMatchedPairs([...matchedPairs, newSelected[0].id]);
                setScore(score + 10);
                setTimeout(() => setSelectedCards([]), 500);

                // Check if game won
                if (matchedPairs.length + 1 === 6) {
                    setTimeout(() => finishGame(score + 10), 600);
                }
            } else {
                // No match
                setTimeout(() => setSelectedCards([]), 1000);
            }
        }
    };

    const isCardSelected = (card) => selectedCards.find(c => c.cardId === card.cardId);
    const isCardMatched = (card) => matchedPairs.includes(card.id);

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
        setWords(generateGameData());
        setSelectedCards([]);
        setMatchedPairs([]);
        setScore(0);
        setTimeLeft(60);
        setGameOver(false);
        setIsSaving(false);
    };

    return (
        <div className="matching-game-container">
            <div className="game-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>🎴 Matching Game</h1>
                <div className="game-stats">
                    <div className="stat">⏱️ {timeLeft}s</div>
                    <div className="stat">⭐ {score} XP</div>
                </div>
            </div>

            {!gameOver ? (
                <div className="cards-grid">
                    {words.map((card) => (
                        <div
                            key={card.cardId}
                            className={`game-card ${isCardSelected(card) ? 'selected' : ''} ${isCardMatched(card) ? 'matched' : ''
                                }`}
                            onClick={() => handleCardClick(card)}
                        >
                            <div className="card-content">
                                {card.type === 'original' ? card.original : card.translation}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="game-over-screen">
                    <div className="game-over-card">
                        <h2>{matchedPairs.length === 6 ? '🎉 You Won!' : '⏰ Time Up!'}</h2>
                        <div className="final-score">Final Score: {score} XP</div>
                        {isSaving && <div className="saving-status">💾 Saving XP...</div>}
                        <div className="matched-count">Matched: {matchedPairs.length}/6</div>
                        <div className="game-over-actions">
                            <button className="btn-restart" onClick={restartGame}>
                                🔄 Play Again
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

export default MatchingGame;
