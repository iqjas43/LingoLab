import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './SentenceBuilder.css';

const LANG_TTS_MAP = {
    'Hindi': 'hi-IN',
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Japanese': 'ja-JP'
};

const SENTENCE_DATA = {
    'Hindi': [
        { english: 'I am learning Hindi', correctOrder: ['Main', 'Hindi', 'seekh', 'raha', 'hoon'], words: ['hoon', 'seekh', 'Main', 'raha', 'Hindi'] },
        { english: 'This is my book', correctOrder: ['Yeh', 'meri', 'kitaab', 'hai'], words: ['kitaab', 'Yeh', 'hai', 'meri'] },
        { english: 'Water is cold', correctOrder: ['Paani', 'thanda', 'hai'], words: ['hai', 'Paani', 'thanda'] },
        { english: 'I like food', correctOrder: ['Mujhe', 'khana', 'pasand', 'hai'], words: ['khana', 'hai', 'Mujhe', 'pasand'] }
    ],
    'English': [
        { english: 'मैं पढ़ रहा हूँ', correctOrder: ['I', 'am', 'reading'], words: ['reading', 'I', 'am'] },
        { english: 'यह एक कुत्ता है', correctOrder: ['This', 'is', 'a', 'dog'], words: ['a', 'is', 'dog', 'This'] },
        { english: 'क्या आप ठीक हैं?', correctOrder: ['Are', 'you', 'okay?'], words: ['okay?', 'you', 'Are'] },
        { english: 'मुझे पानी चाहिए', correctOrder: ['I', 'want', 'water'], words: ['water', 'want', 'I'] }
    ],
    'Spanish': [
        { english: 'I am a student', correctOrder: ['Yo', 'soy', 'estudiante'], words: ['soy', 'Yo', 'estudiante'] },
        { english: 'The house is big', correctOrder: ['La', 'casa', 'es', 'grande'], words: ['casa', 'grande', 'es', 'La'] },
        { english: 'I have a cat', correctOrder: ['Yo', 'tengo', 'un', 'gato'], words: ['gato', 'un', 'tengo', 'Yo'] },
        { english: 'Where is the bathroom?', correctOrder: ['¿Dónde', 'está', 'el', 'baño?'], words: ['está', 'el', '¿Dónde', 'baño?'] }
    ],
    'French': [
        { english: 'I speak French', correctOrder: ['Je', 'parle', 'français'], words: ['français', 'parle', 'Je'] },
        { english: 'She is beautiful', correctOrder: ['Elle', 'est', 'belle'], words: ['belle', 'est', 'Elle'] },
        { english: 'I want a coffee', correctOrder: ['Je', 'veux', 'un', 'café'], words: ['café', 'un', 'veux', 'Je'] },
        { english: 'The cat is black', correctOrder: ['Le', 'chat', 'est', 'noir'], words: ['noir', 'est', 'chat', 'Le'] }
    ],
    'Japanese': [
        { english: 'I am a student', correctOrder: ['Watashi', 'wa', 'gakusei', 'desu'], words: ['wa', 'desu', 'gakusei', 'Watashi'] },
        { english: 'This is a pen', correctOrder: ['Kore', 'wa', 'pen', 'desu'], words: ['wa', 'pen', 'desu', 'Kore'] },
        { english: 'I like sushi', correctOrder: ['Sushi', 'ga', 'suki', 'desu'], words: ['suki', 'ga', 'desu', 'Sushi'] },
        { english: 'It is tasty', correctOrder: ['Oishii', 'desu'], words: ['desu', 'Oishii'] }
    ]
};

function SentenceBuilder() {
    const navigate = useNavigate();
    const { user, currentCourse } = useOutletContext();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedWords, setSelectedWords] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [questions, setQuestions] = useState([]);

    const langName = currentCourse?.language || 'Hindi';
    const currentPool = SENTENCE_DATA[langName] || SENTENCE_DATA['Hindi'];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateQuestions = () => {
        return shuffleArray(currentPool).slice(0, 5);
    };

    useEffect(() => {
        setQuestions(generateQuestions());
    }, [langName]);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = LANG_TTS_MAP[langName] || 'hi-IN';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    };

    const currentQ = questions.length > 0 ? questions[currentQuestion] : null;
    const availableWords = currentQ ? currentQ.words.filter(word => !selectedWords.includes(word)) : [];

    const selectWord = (word) => {
        speak(word);
        setSelectedWords([...selectedWords, word]);
    };

    const removeWord = (index) => {
        const newSelected = [...selectedWords];
        newSelected.splice(index, 1);
        setSelectedWords(newSelected);
    };

    const checkAnswer = () => {
        const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(currentQ.correctOrder);

        if (isCorrect) {
            const newScore = score + 15;
            setScore(newScore);
            setFeedback('correct');
            speak(currentQ.correctOrder.join(' '));
            setTimeout(() => {
                if (currentQuestion + 1 < questions.length) {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedWords([]);
                    setFeedback(null);
                } else {
                    finishGame(newScore);
                }
            }, 1500);
        } else {
            setFeedback('incorrect');
            setTimeout(() => setFeedback(null), 1500);
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

    const reset = () => {
        setSelectedWords([]);
        setFeedback(null);
    };

    const restartGame = () => {
        setQuestions(generateQuestions());
        setCurrentQuestion(0);
        setSelectedWords([]);
        setScore(0);
        setFeedback(null);
        setGameOver(false);
        setIsSaving(false);
    };

    return (
        <div className="sentence-builder-container">
            <div className="game-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>🔤 Sentence Builder</h1>
                <div className="game-stats">
                    <div className="stat">📝 {currentQuestion + 1}/{questions.length}</div>
                    <div className="stat">⭐ {score} XP</div>
                </div>
            </div>

            {!gameOver ? (
                <div className="builder-container">
                    <div className="builder-card">
                        {!currentQ ? (
                            <div className="loading">Loading questions...</div>
                        ) : (
                            <>
                                <div className="question-prompt">
                                    <div className="prompt-label">Build this sentence in {langName}:</div>
                                    <div className="english-sentence">{currentQ.english}</div>
                                </div>

                                <div className={`sentence-area ${feedback ? feedback : ''}`}>
                                    {selectedWords.length === 0 ? (
                                        <div className="placeholder">Tap words below to build sentence...</div>
                                    ) : (
                                        selectedWords.map((word, index) => (
                                            <div key={index} className="selected-word" onClick={() => removeWord(index)}>
                                                {word}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="word-bank">
                                    {availableWords.map((word, index) => (
                                        <div key={index} className="word-tile" onClick={() => selectWord(word)}>
                                            {word}
                                        </div>
                                    ))}
                                </div>

                                <div className="action-buttons">
                                    <button className="btn-reset" onClick={reset}>
                                        🔄 Reset
                                    </button>
                                    <button
                                        className="btn-check"
                                        onClick={checkAnswer}
                                        disabled={selectedWords.length === 0 || feedback === 'correct'}
                                    >
                                        ✓ Check Answer
                                    </button>
                                </div>

                                {feedback && (
                                    <div className={`feedback-message ${feedback}`}>
                                        {feedback === 'correct' ? '🎉 Perfect!' : '❌ Try again!'}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="game-over-screen">
                    <div className="game-over-card">
                        <h2>🎯 Great Job!</h2>
                        <div className="final-score">Final Score: {score} XP</div>
                        {isSaving && <div className="saving-status">💾 Saving XP...</div>}
                        <div className="questions-count">Completed: {questions.length} sentences</div>
                        <div className="game-over-actions">
                            <button className="btn-restart" onClick={restartGame}>
                                🔄 Practice Again
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

export default SentenceBuilder;
