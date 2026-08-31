import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import './Dashboard.css';

function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  // Consume global state
  const { courses, selectedCourseId, user } = useOutletContext();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  // [NEW] Dictionary State
  const [dictData, setDictData] = useState(null);
  const [showDict, setShowDict] = useState(false);
  const [loadingDict, setLoadingDict] = useState(false);
  const [targetWord, setTargetWord] = useState(''); // Store the word in target language

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/courses/lesson/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setUnit(data);
        } else {
          setUnit(null);
        }
      } catch (err) {
        console.error("Fetch Lesson Error:", err);
        setUnit(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className="loading-screen">Loading Lesson...</div>;

  if (!unit) {
    return (
      <div className="error-screen">
        <div style={{ textAlign: 'center' }}>
          <h2>Lesson Not Found</h2>
          <p>We couldn't find the content for this unit.</p>
          <button className="btn-start" style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const themeColor = '#4f46e5';

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
    const currentLang = courses.find(c => c.courseId === Number(selectedCourseId))?.language || 'English';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_VOICE_MAP[currentLang] || 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const fetchDictionary = async (translation, original) => {
    setLoadingDict(true);
    setShowDict(true);
    setDictData(null);
    setTargetWord(original);

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${translation}`);
      if (res.ok) {
        const data = await res.json();
        setDictData(data[0]);
      } else {
        setDictData({ error: "Definition not found" });
      }
    } catch (err) {
      console.error("Dictionary Error:", err);
      setDictData({ error: "Failed to fetch meaning" });
    } finally {
      setLoadingDict(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${lessonId}?lang=${courses.find(c => c.courseId === Number(selectedCourseId))?.language}`);
  };

  return (
    <div className="dashboard-content-wrapper" style={{ minHeight: '100vh', background: 'white' }}>
      <div className="lesson-header" style={{ background: themeColor, padding: '40px', borderRadius: '0 0 40px 40px', color: 'white', textAlign: 'center', boxShadow: '0 10px 30px -10px ' + themeColor }}>
        <h4 style={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', marginBottom: '10px' }}>{unit.type}</h4>
        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>{unit.title}</h1>
      </div>

      <div className="dashboard-content" style={{ marginTop: '-40px' }}>

        {/* Render Vocabulary */}
        {unit.content?.vocabulary && (
          <div className="lessons-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {unit.content.vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="lesson-card"
                onClick={() => fetchDictionary(item.translation, item.word)}
                style={{ textAlign: 'center', padding: '40px 20px', borderTop: `4px solid ${themeColor}`, cursor: 'pointer' }}
              >
                <div style={{ fontSize: '18px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>{item.translation}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{item.word}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSpeak(item.word); }}
                  style={{ marginTop: '15px', width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#f1f5f9', color: themeColor, fontSize: '18px', cursor: 'pointer' }}
                >🔊</button>
              </div>
            ))}
          </div>
        )}

        {/* Render Patterns */}
        {unit.content?.pattern && (
          <div className="pattern-section" style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', marginTop: '20px' }}>
            <h2 style={{ marginBottom: '15px' }}>{unit.content.pattern.description}</h2>
            {unit.content.pattern.examples.map((ex, idx) => (
              <div key={idx} className="example-item" style={{ marginBottom: '10px', padding: '15px', background: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{ex.hindi}</div>
                  <div style={{ color: '#64748b' }}>{ex.english}</div>
                </div>
                <button onClick={() => handleSpeak(ex.hindi)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🔊</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginTop: '60px', justifyContent: 'center' }}>
          <button className="btn-quiz" onClick={() => navigate('/dashboard')} style={{ padding: '16px 32px', fontSize: '18px' }}>Back</button>
          <button className="btn-start" onClick={handleStartQuiz} style={{ padding: '16px 50px', fontSize: '18px', background: themeColor }}>Start Quiz 🚀</button>
        </div>
      </div>

      {showDict && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowDict(false)}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', cursor: 'default' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '28px', textTransform: 'capitalize' }}>{targetWord}</h2>
              <button onClick={() => setShowDict(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <button
              onClick={() => handleSpeak(targetWord)}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>🗣️ Speak "{targetWord}"</button>
            {loadingDict ? <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div> : dictData?.error ? <p>{dictData.error}</p> : (
              <div>
                {dictData?.meanings?.slice(0, 2).map((m, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', color: '#64748b' }}>{m.partOfSpeech}</div>
                    <ul>{m.definitions.slice(0, 2).map((d, j) => <li key={j}>{d.definition}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lesson;
