import React, { useState, useCallback } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import './Words.css';
import { speak } from './utils/speechUtils';

const WORDS_DATA = {
    'Hindi': [
        {
            id: 'people_main',
            category: 'People',
            type: 'main',
            theme: 'orange-theme',
            avatar: '🧑‍🦱',
            words: [
                { word: 'आदमी', translation: 'Man', pronunciation: 'Aadmi' },
                { word: 'औरत', translation: 'Woman', pronunciation: 'Aurat' },
                { word: 'लड़का', translation: 'Boy', pronunciation: 'Ladka' },
                { word: 'लड़की', translation: 'Girl', pronunciation: 'Ladki' },
                { word: 'लोग', translation: 'People', pronunciation: 'Log' },
                { word: 'बच्चा', translation: 'Child', pronunciation: 'Bachcha' },
                { word: 'बुजुर्ग', translation: 'Elderly', pronunciation: 'Bujurg' },
                { word: 'युवा', translation: 'Youth', pronunciation: 'Yuva' },
                { word: 'दोस्त', translation: 'Friend', pronunciation: 'Dost' },
                { word: 'पड़ोसी', translation: 'Neighbor', pronunciation: 'Padosi' },
                { word: 'अतिथि', translation: 'Guest', pronunciation: 'Atithi' },
                { word: 'व्यक्ति', translation: 'Person', pronunciation: 'Vyakti' },
                { word: 'इंसान', translation: 'Human', pronunciation: 'Insaan' },
                { word: 'शिक्षक', translation: 'Teacher', pronunciation: 'Shikshak' },
                { word: 'छात्र', translation: 'Student', pronunciation: 'Chhatr' },
                { word: 'डॉक्टर', translation: 'Doctor', pronunciation: 'Doctor' },
                { word: 'मरीज़', translation: 'Patient', pronunciation: 'Mareez' },
                { word: 'नेता', translation: 'Leader', pronunciation: 'Neta' },
            ]
        },
        {
            id: 'family',
            category: 'Family',
            type: 'sub',
            theme: 'yellow-theme',
            words: [
                { word: 'परिवार', translation: 'Family', pronunciation: 'Parivaar' },
                { word: 'माँ', translation: 'Mother', pronunciation: 'Maa' },
                { word: 'पिता', translation: 'Father', pronunciation: 'Pita' },
                { word: 'भाई', translation: 'Brother', pronunciation: 'Bhai' },
                { word: 'बहन', translation: 'Sister', pronunciation: 'Behen' },
            ]
        },
        {
            id: 'love_friendship',
            category: 'Love & Friendship',
            type: 'sub',
            theme: 'yellow-theme',
            words: [
                { word: 'प्यार', translation: 'Love', pronunciation: 'Pyaar' },
                { word: 'दोस्ती', translation: 'Friendship', pronunciation: 'Dosti' },
                { word: 'साथी', translation: 'Partner', pronunciation: 'Saathi' },
                { word: 'सहेली', translation: 'Female Friend', pronunciation: 'Saheli' },
                { word: 'दोस्त', translation: 'Friend', pronunciation: 'Dost' },
            ]
        },
        {
            id: 'identity',
            category: 'Identity',
            type: 'sub',
            theme: 'yellow-theme',
            words: [
                { word: 'नाम', translation: 'Name', pronunciation: 'Naam' },
                { word: 'उम्र', translation: 'Age', pronunciation: 'Umr' },
                { word: 'पहचान', translation: 'Identity', pronunciation: 'Pehchaan' },
                { word: 'राष्ट्रीयता', translation: 'Nationality', pronunciation: 'Rashtriyata' },
            ]
        },
        {
            id: 'age_life_events',
            category: 'Age & Life Events',
            type: 'sub',
            theme: 'yellow-theme',
            words: [
                { word: 'जन्म', translation: 'Birth', pronunciation: 'Janm' },
                { word: 'बचपन', translation: 'Childhood', pronunciation: 'Bachpan' },
                { word: 'जवानी', translation: 'Youth', pronunciation: 'Jawaani' },
                { word: 'बुढ़ापा', translation: 'Old Age', pronunciation: 'Budhaapa' },
            ]
        },
        {
            id: 'describing_people_main',
            category: 'Describing People',
            type: 'main',
            theme: 'purple-theme',
            avatar: '📜',
            words: [
                { word: 'लंबा', translation: 'Tall', pronunciation: 'Lamba' },
                { word: 'छोटा', translation: 'Short', pronunciation: 'Chhota' },
                { word: 'सुंदर', translation: 'Beautiful', pronunciation: 'Sundar' },
                { word: 'बदसूरत', translation: 'Ugly', pronunciation: 'Badsoorat' },
                { word: 'मोटा', translation: 'Fat', pronunciation: 'Mota' },
                { word: 'पतला', translation: 'Thin', pronunciation: 'Patla' },
                { word: 'बूढ़ा', translation: 'Old', pronunciation: 'Boodha' },
                { word: 'जवान', translation: 'Young', pronunciation: 'Jawaan' },
                { word: 'खुश', translation: 'Happy', pronunciation: 'Khush' },
                { word: 'उदास', translation: 'Sad', pronunciation: 'Udaas' },
                { word: 'गुस्सा', translation: 'Angry', pronunciation: 'Gussa' },
                { word: 'शांत', translation: 'Calm', pronunciation: 'Shaant' },
                { word: 'ईमानदार', translation: 'Honest', pronunciation: 'Imaandaar' },
                { word: 'चालाक', translation: 'Clever', pronunciation: 'Chaalak' },
                { word: 'मूर्ख', translation: 'Foolish', pronunciation: 'Moorkh' },
                { word: 'बहादुर', translation: 'Brave', pronunciation: 'Bahadur' },
                { word: 'डरपोक', translation: 'Coward', pronunciation: 'Darpok' },
                { word: 'अमीर', translation: 'Rich', pronunciation: 'Ameer' },
                { word: 'गरीब', translation: 'Poor', pronunciation: 'Gareeb' },
                { word: 'ताकतवर', translation: 'Strong', pronunciation: 'Taakatwar' },
                { word: 'कमजोर', translation: 'Weak', pronunciation: 'Kamzor' },
                { word: 'स्वस्थ', translation: 'Healthy', pronunciation: 'Swasth' },
                { word: 'बीमार', translation: 'Sick', pronunciation: 'Beemaar' },
                { word: 'थका हुआ', translation: 'Tired', pronunciation: 'Thaka hua' },
                { word: 'अंधा', translation: 'Blind', pronunciation: 'Andha' },
                { word: 'बहरा', translation: 'Deaf', pronunciation: 'Bahra' },
                { word: 'गूंगा', translation: 'Mute', pronunciation: 'Goonga' },
                { word: 'गंजा', translation: 'Bald', pronunciation: 'Ganja' },
                { word: 'गोरा', translation: 'Fair', pronunciation: 'Gora' },
                { word: 'सांवला', translation: 'Dusky', pronunciation: 'Saanvla' },
                { word: 'स्मार्ट', translation: 'Smart', pronunciation: 'Smart' },
                { word: 'आलसी', translation: 'Lazy', pronunciation: 'Aalsi' },
                { word: 'मेहनती', translation: 'Hardworking', pronunciation: 'Mehnati' },
                { word: 'दयालु', translation: 'Kind', pronunciation: 'Dayalu' },
            ]
        }
    ],
    'English': [
        // Dummy data for English layout
        {
            id: 'people_en',
            category: 'People',
            type: 'main',
            theme: 'orange-theme',
            avatar: '🧑‍🦱',
            words: [
                { word: 'Man', translation: 'Man', pronunciation: 'Man' },
                { word: 'Woman', translation: 'Woman', pronunciation: 'Woman' },
            ]
        },
        {
            id: 'family_en',
            category: 'Family',
            type: 'sub',
            theme: 'yellow-theme',
            words: [
                { word: 'Family', translation: 'Family', pronunciation: 'Family' },
            ]
        }
    ],
    // Fallback for others
    'Spanish': [
        {
            id: 'people_es',
            category: 'Gente (People)',
            type: 'main',
            theme: 'orange-theme',
            avatar: '🧑‍🦱',
            words: [
                { word: 'Hombre', translation: 'Man', pronunciation: 'Om-bre' },
                { word: 'Mujer', translation: 'Woman', pronunciation: 'Mu-her' },
            ]
        }
    ]
};

function WordsTabNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="vocab-tabs">
            <button
                className={`vocab-tab ${location.pathname === '/letters' || location.pathname === '/vocabulary' ? 'active' : ''}`}
                onClick={() => navigate('/letters')}
            >
                Alphabet
            </button>
            <button
                className={`vocab-tab ${location.pathname === '/words' ? 'active' : ''}`}
                onClick={() => navigate('/words')}
            >
                Words
            </button>
            <button
                className={`vocab-tab ${location.pathname === '/sentences' ? 'active' : ''}`}
                onClick={() => navigate('/sentences')}
                disabled
                title="Coming Soon"
            >
                Sentences
            </button>
        </div>
    );
}

function Words() {
    const { currentCourse } = useOutletContext();
    const lang = currentCourse?.language || 'Hindi';
    const data = WORDS_DATA[lang] || WORDS_DATA['Hindi'];

    const [selectedCategory, setSelectedCategory] = useState(null);
    // LANG_TTS_MAP moved to speechUtils.js

    const handleSpeak = useCallback((text) => {
        speak(text, lang, 0.9);
    }, [lang]);

    // Provide a simple word list view when clicked
    if (selectedCategory) {
        return (
            <div className="words-page">
                <WordsTabNavigation />
                <div className="words-content">
                    <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                        ← Back to Categories
                    </button>
                    <h2 className="category-detail-title">{selectedCategory.category}</h2>
                    <div className="words-list">
                        {selectedCategory.words.map((item, idx) => (
                            <div key={idx} className="word-detail-card" onClick={() => handleSpeak(item.word)}>
                                <div className="word-header-row">
                                    <div className="word-main">{item.word}</div>
                                    <button className="speak-btn-circle" onClick={(e) => { e.stopPropagation(); handleSpeak(item.word); }}>
                                        🔊
                                    </button>
                                </div>
                                <div className="word-sub">
                                    <span className="word-pronunciation">{item.pronunciation}</span>
                                    <span className="word-translation">{item.translation}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="words-page">
            <header className="words-header">
                <div className="course-flags">
                    <span className="flag">🎓</span>
                </div>
                <div className="streaks">
                    <span className="streak-item">🌸 0</span>
                    <span className="streak-item">🐝 0</span>
                </div>
                <div className="header-actions">
                    <span className="icon">🔍</span>
                    <span className="icon notif">🔔<span className="badge">4</span></span>
                </div>
            </header>

            <WordsTabNavigation />

            <div className="words-content">
                <div className="categories-list">
                    {data.map((cat, idx) => {
                        if (cat.type === 'main') {
                            return (
                                <div key={idx} className={`word-cat-card main-cat ${cat.theme}`} onClick={() => setSelectedCategory(cat)}>
                                    <div className="cat-info">
                                        <h3>{cat.category}</h3>
                                        <div className="word-count-badge">
                                            <span className="current">0</span>/<span className="total">{cat.words.length}</span>
                                            <div className="badge-text">words</div>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                    <div className="cat-avatar">{cat.avatar}</div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={idx} className={`word-cat-card sub-cat ${cat.theme}`} onClick={() => setSelectedCategory(cat)}>
                                    <div className="cat-info-row">
                                        <div>
                                            <h3>{cat.category}</h3>
                                            <div className="sub-count">{cat.words.length} words</div>
                                        </div>
                                        <div className="play-btn">▶</div>
                                    </div>
                                    <div className="progress-bar-bg small">
                                        <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export { WordsTabNavigation };
export default Words;
