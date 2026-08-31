import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './FillInBlank.css';

const LANG_TTS_MAP = {
    'Hindi': 'hi-IN',
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Japanese': 'ja-JP'
};

const FILL_BLANK_DATA = {
    'Hindi': [
        { sentence: 'Namaste! Aap kaise ___?', answer: 'hain', translation: 'Hello! How are you?', hint: 'Starts with "h", 4 letters', speakText: 'Namaste! Aap kaise hain?' },
        { sentence: 'Main theek ___, dhanyavaad.', answer: 'hoon', translation: 'I am fine, thank you.', hint: 'Starts with "h", 4 letters', speakText: 'Main theek hoon, dhanyavaad.' },
        { sentence: 'Mera ___ Junaid hai.', answer: 'naam', translation: 'My name is Junaid.', hint: 'Starts with "n", 4 letters', speakText: 'Mera naam Junaid hai.' },
        { sentence: 'Mujhe aam ___ hai.', answer: 'pasand', translation: 'I like mango.', hint: 'Starts with "p", 6 letters', speakText: 'Mujhe aam pasand hai.' }
    ],
    'English': [
        { sentence: 'I am a ___.', answer: 'boy', translation: 'मैं एक लड़का हूँ (Main ek ladka hoon)', hint: 'लड़का (Ladka)', speakText: 'I am a boy.' },
        { sentence: 'This is my ___.', answer: 'book', translation: 'यह मेरी किताब है (Yeh meri kitab hai)', hint: 'किताब (Kitab)', speakText: 'This is my book.' },
        { sentence: 'The sky is ___.', answer: 'blue', translation: 'आसमान नीला है (Aasman neela hai)', hint: 'नीला (Neela)', speakText: 'The sky is blue.' },
        { sentence: 'I love my ___.', answer: 'family', translation: 'मैं अपने परिवार से प्यार करता हूँ', hint: 'परिवार (Parivar)', speakText: 'I love my family.' }
    ],
    'Spanish': [
        { sentence: 'Hola! Cómo ___?', answer: 'estás', translation: 'Hello! How are you?', hint: 'Starts with "e"', speakText: 'Hola! Cómo estás?' },
        { sentence: 'Mucho ___.', answer: 'gusto', translation: 'Nice to meet you.', hint: 'Starts with "g"', speakText: 'Mucho gusto.' },
        { sentence: 'Yo ___ español.', answer: 'hablo', translation: 'I speak Spanish.', hint: 'I speak', speakText: 'Yo hablo español.' },
        { sentence: 'La casa es ___.', answer: 'grande', translation: 'The house is big.', hint: 'Big', speakText: 'La casa es grande.' }
    ],
    'French': [
        { sentence: 'Comment ça ___?', answer: 'va', translation: 'How is it going?', hint: 'Starts with "v"', speakText: 'Comment ça va?' },
        { sentence: 'Je ___ français.', answer: 'parle', translation: 'I speak French.', hint: 'I speak', speakText: 'Je parle français.' },
        { sentence: 'La ___ est belle.', answer: 'vie', translation: 'Life is beautiful.', hint: 'Life', speakText: 'La vie est belle.' },
        { sentence: 'Je t\'___.', answer: 'aime', translation: 'I love you.', hint: 'Love', speakText: 'Je t\'aime.' }
    ],
    'Japanese': [
        { sentence: 'Ogenki ___ ka?', answer: 'desu', translation: 'How are you?', hint: 'Are you', speakText: 'Ogenki desu ka?' },
        { sentence: 'Watashi wa ___ desu.', answer: 'Junaid', translation: 'I am Junaid.', hint: 'Name', speakText: 'Watashi wa Junaid desu.' },
        { sentence: 'Sore wa ___ desu.', answer: 'hon', translation: 'That is a book.', hint: 'Book', speakText: 'Sore wa hon desu.' },
        { sentence: 'Kore wa ___ desu.', answer: 'mizu', translation: 'This is water.', hint: 'Water', speakText: 'Kore wa mizu desu.' }
    ]
};

function FillInBlank() {
    const navigate = useNavigate();
    const { user, currentCourse } = useOutletContext();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const langName = currentCourse?.language || 'Hindi';
    const currentPool = FILL_BLANK_DATA[langName] || FILL_BLANK_DATA['Hindi'];

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

    const checkAnswer = () => {
        const isCorrect = userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase();

        if (isCorrect) {
            setFeedback('correct');
            const newScore = score + 10;
            setScore(newScore);
            speak(currentQ.speakText);
            setTimeout(() => {
                if (currentQuestion + 1 < questions.length) {
                    setCurrentQuestion(currentQuestion + 1);
                    setUserAnswer('');
                    setFeedback(null);
                    setShowHint(false);
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

    const skipQuestion = () => {
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setUserAnswer('');
            setFeedback(null);
            setShowHint(false);
        } else {
            setGameOver(true);
        }
    };

    const restartGame = () => {
        setQuestions(generateQuestions());
        setCurrentQuestion(0);
        setUserAnswer('');
        setScore(0);
        setShowHint(false);
        setFeedback(null);
        setGameOver(false);
        setIsSaving(false);
    };

    return (
        <div className="fill-blank-container">
            <div className="game-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>✍️ Fill in the Blank</h1>
                <div className="game-stats">
                    <div className="stat">📝 {currentQuestion + 1}/{questions.length}</div>
                    <div className="stat">⭐ {score} XP</div>
                </div>
            </div>

            {!gameOver ? (
                <div className="question-container">
                    {!currentQ ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="question-card">
                            <div className="question-number">Question {currentQuestion + 1}</div>

                            <div className="sentence-display">
                                {currentQ.sentence}
                            </div>

                            <div className="translation">{currentQ.translation}</div>

                            <div className="answer-area">
                                <input
                                    type="text"
                                    className={`answer-input ${feedback ? feedback : ''}`}
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                    placeholder="Type your answer..."
                                    disabled={feedback === 'correct'}
                                />

                                {feedback === 'correct' && <span className="feedback-icon">✅</span>}
                                {feedback === 'incorrect' && <span className="feedback-icon">❌</span>}
                            </div>

                            <div className="hint-section">
                                {!showHint ? (
                                    <button className="btn-hint" onClick={() => setShowHint(true)}>
                                        💡 Show Hint
                                    </button>
                                ) : (
                                    <div className="hint-text">
                                        💡 Hint: {currentQ.hint}
                                    </div>
                                )}
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="btn-submit"
                                    onClick={checkAnswer}
                                    disabled={!userAnswer || feedback === 'correct'}
                                >
                                    Submit Answer
                                </button>
                                <button className="btn-skip" onClick={skipQuestion}>
                                    Skip →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="game-over-screen">
                    <div className="game-over-card">
                        <h2>🎉 Exercise Complete!</h2>
                        <div className="final-score">Final Score: {score} XP</div>
                        {isSaving && <div className="saving-status">💾 Saving XP...</div>}
                        <div className="questions-count">Completed: {questions.length} questions</div>
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

export default FillInBlank;
