import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Phrases.css';
import { speak } from './utils/speechUtils';

const MULTI_LANG_PHRASES = {
    'Hindi': [
        {
            category: 'Idioms (मुहावरे)',
            items: [
                { phrase: 'अंगूठा दिखाना', roman: 'Angootha dikhana', meaning: 'To refuse at the last moment', example: 'उसने मुझे अंगूठा दिखा दिया।' },
                { phrase: 'आँखों का तारा', roman: 'Aankhon ka tara', meaning: 'Very dear / beloved', example: 'वह अपनी माँ की आँखों का तारा है।' }
            ]
        },
        {
            category: 'Daily Expressions',
            items: [
                { phrase: 'नमस्ते', roman: 'Namaste', meaning: 'Hello', example: 'नमस्ते, आप कैसे हैं?' },
                { phrase: 'फिर मिलते हैं', roman: 'Phir milte hain', meaning: 'See you later', example: 'आज के लिए इतना ही, फिर मिलते हैं!' }
            ]
        }
    ],
    'English': [
        {
            category: 'Common Idioms',
            items: [
                { phrase: 'Piece of cake', roman: 'Aasaan kaam', meaning: 'Something very easy', example: 'This exam was a piece of cake.' },
                { phrase: 'Break a leg', roman: 'Shubhkaamna', meaning: 'Good luck', example: 'Break a leg on your performance tonight!' }
            ]
        },
        {
            category: 'Daily Phrases',
            items: [
                { phrase: 'How are you?', roman: 'Aap kaise hain?', meaning: 'आप कैसे हैं?', example: 'Hi! How are you doing?' },
                { phrase: 'Nice to meet you', roman: 'Milkar khushi hui', meaning: 'आपसे मिलकर खुशी हुई', example: 'It was nice to meet you, Rahul.' }
            ]
        }
    ],
    'Spanish': [
        {
            category: 'Modismos (Idioms)',
            items: [
                { phrase: 'Pan comido', roman: 'Piece of cake', meaning: 'Very easy', example: 'El examen fue pan comido.' },
                { phrase: 'Tomar el pelo', roman: 'Pulling someone\'s leg', meaning: 'To tease or trick', example: '¿Me estás tomando el pelo?' }
            ]
        },
        {
            category: 'Frases Diarias',
            items: [
                { phrase: 'Buenos días', roman: 'Good morning', meaning: 'Good morning', example: 'Buenos días a todos.' },
                { phrase: 'Muchas gracias', roman: 'Thank you very much', meaning: 'Thank you very much', example: 'Muchas gracias por su ayuda.' }
            ]
        }
    ],
    'French': [
        {
            category: 'Idiomatismes',
            items: [
                { phrase: 'C\'est du gâteau', roman: 'Piece of cake', meaning: 'It\'s very easy', example: 'Ce travail, c\'est du gâteau.' },
                { phrase: 'Appeler un chat un chat', roman: 'To speak frankly', meaning: 'To call a spade a spade', example: 'Il faut appeler un chat un chat.' }
            ]
        },
        {
            category: 'Expressions Quotidiennes',
            items: [
                { phrase: 'Comment ça va?', roman: 'How is it going?', meaning: 'How are you?', example: 'Salut! Comment ça va?' },
                { phrase: 'Bonne journée', roman: 'Have a good day', meaning: 'Have a good day', example: 'Merci, bonne journée!' }
            ]
        }
    ],
    'Japanese': [
        {
            category: 'Kanyouku (Idioms)',
            items: [
                { phrase: 'ねこのてをかりたい', roman: 'Neko no te wo karitai', meaning: 'Very busy', example: '忙しくて猫の手も借りたいです。' },
                { phrase: 'はながたかい', roman: 'Hana ga takai', meaning: 'To be proud', example: '息子が優勝して鼻が高いです。' }
            ]
        },
        {
            category: 'Mainichi no Hyougen',
            items: [
                { phrase: 'お元気ですか？', roman: 'O-genki desu ka?', meaning: 'How are you?', example: 'お久しぶりです。お元気ですか？' },
                { phrase: 'はじめまして', roman: 'Hajimemashite', meaning: 'Nice to meet you', example: 'はじめまして、田中です。' }
            ]
        }
    ]
};

// LANG_TTS_MAP moved to speechUtils.js

function Phrases() {
    const { currentCourse } = useOutletContext();
    const langName = currentCourse?.language || 'Hindi';
    const phrasesData = MULTI_LANG_PHRASES[langName] || MULTI_LANG_PHRASES['Hindi'];

    const handleSpeak = useCallback((text) => {
        speak(text, langName, 0.85);
    }, [langName]);

    return (
        <div className="phrases-container">
            <header className="phrases-header">
                <h1>💡 {langName} Phrases & Idioms</h1>
                <p>Learn idiomatic expressions and daily phrases in {langName} to sound like a native speaker.</p>
            </header>

            <div className="phrases-content">
                {phrasesData.map((section, idx) => (
                    <div key={idx} className="phrase-category-section">
                        <h2 className="category-title">{section.category}</h2>
                        <div className="phrases-list">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="phrase-card" onClick={() => handleSpeak(item.phrase)} style={{ cursor: 'pointer' }}>
                                    <div className="phrase-header">
                                        <div className="label">PHRASE <span className="speak-hint">🔊</span></div>
                                        <div className="content">
                                            <h3>{item.phrase}</h3>
                                            <span className="roman">{item.roman}</span>
                                        </div>
                                    </div>
                                    <div className="phrase-detail">
                                        <div className="detail-item">
                                            <div className="label">MEANING</div>
                                            <div className="text">{item.meaning}</div>
                                        </div>
                                        <div className="detail-item" onClick={(e) => { e.stopPropagation(); handleSpeak(item.example); }}>
                                            <div className="label">EXAMPLE (Tap below)</div>
                                            <div className="text italic">"{item.example}"</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Phrases;
