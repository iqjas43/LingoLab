import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lang = queryParams.get('lang') || 'Hindi';

  // Consume global state for userId and courseId
  const { user, selectedCourseId, fetchUser } = useOutletContext();

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

  const LANG_VOICE_MAP = {
    'Hindi': 'hi-IN',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Japanese': 'ja-JP',
    'English': 'en-US'
  };

  const handleSpeak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    // Slight delay to ensure previous synthesis is fully cancelled
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = LANG_VOICE_MAP[lang] || 'en-US';
      utterance.lang = langCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`http://localhost:3000/api/quiz/lesson/${lessonId}?lang=${lang}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [lessonId, lang]);

  const handleAnswer = (selectedIndex) => {
    if (feedback) return; // Prevent double clicks

    const currentQ = questions[currentQIndex];
    const isCorrect = selectedIndex === currentQ.correctIndex;

    if (isCorrect) {
      setScore(s => s + 10); // +10 XP per correct answer
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        finishQuiz(score + (isCorrect ? 10 : 0));
      }
    }, 1000);
  };

  const finishQuiz = async (finalScore) => {
    setQuizFinished(true);

    if (!user) return;

    // Calculate if perfect quiz
    const isPerfect = finalScore === (questions.length * 10);

    // 1. Update XP (Gamification)
    try {
      await fetch('http://localhost:3000/api/auth/xp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          xpAmount: finalScore,
          lessonsIncrement: 1, // Changed from 0 to 1
          isPerfectQuiz: isPerfect
        })
      });
    } catch (err) {
      console.error('Failed to update XP', err);
    }

    // 2. Mark Lesson Complete (Progress)
    try {
      if (selectedCourseId) {
        await fetch('http://localhost:3000/api/progress/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            courseId: selectedCourseId, // Internal or numeric ID
            lessonId: lessonId, // Fixed: handle both internal ObjectId and numeric unitId string
            language: lang
          })
        });
        console.log("Lesson marked complete via Quiz");
        
        // Refresh global user state immediately
        if (fetchUser) {
          await fetchUser();
        }
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Quiz for {lang}...</div>;
  if (!questions.length) return <div style={{ color: 'white', padding: '20px' }}>No questions found for this lesson yet. <button onClick={() => navigate('/dashboard')}>Go Back</button></div>;

  const currentQ = questions[currentQIndex];

  if (quizFinished) {
    return (
      <div className="quiz-screen">
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <h1>🎉 Quiz Complete!</h1>
          <h2>You earned {score} XP</h2>
          <h3 style={{ color: '#4caf50', marginTop: '10px' }}>Lesson Completed! ✅</h3>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="quiz-title">Quiz: {lang} Lesson {lessonId}</h1>
          <div className="quiz-subinfo">
            <span>Score: {score} XP</span>
            <span>Question {currentQIndex + 1}/{questions.length}</span>
          </div>
        </div>

        {/* Question */}
        <div className="quiz-word-box">
          <div className="quiz-word-en">Translate: {currentQ.word}</div>
          <button
            className="quiz-speak-btn"
            onClick={() => handleSpeak(currentQ.word)}
            title="Hear pronunciation">
            🔊
          </button>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div style={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: feedback === 'correct' ? '#4caf50' : '#f44336'
          }}>
            {feedback === 'correct' ? 'Correct! 🎉' : 'Oops! ❌'}
          </div>
        )}

        {/* Options */}
        <div className="quiz-options">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="quiz-btn"
              style={{
                backgroundColor: feedback
                  ? (idx === currentQ.correctIndex ? '#4caf50' : (feedback === 'wrong' && idx === currentQ.correctIndex ? '#4caf50' : '#282c34'))
                  : '#282c34'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Quiz;
