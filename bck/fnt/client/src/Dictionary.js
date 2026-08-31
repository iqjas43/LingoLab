import React, { useState, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './Dictionary.css';
import { speak } from './utils/speechUtils';

const MULTI_LANG_DICTIONARY = {
    'Hindi': [
        { word: 'नमस्ते', roman: 'Namaste', meaning: 'Hello / Greetings', example: 'नमस्ते, आप कैसे हैं?', type: 'Greeting' },
        { word: 'धन्यवाद', roman: 'Dhanyavaad', meaning: 'Thank you', example: 'बहुत-बहुत धन्यवाद।', type: 'Common' },
        { word: 'नाम', roman: 'Naam', meaning: 'Name', example: 'मेरा नाम राहुल है।', type: 'People' },
        { word: 'घर', roman: 'Ghar', meaning: 'Home / House', example: 'मेरा घर सुंदर है।', type: 'Places' },
        { word: 'दोस्त', roman: 'Dost', meaning: 'Friend', example: 'वह मेरा सबसे अच्छा दोस्त है।', type: 'People' }
    ],
    'English': [
        { word: 'Apple', roman: 'Seb', meaning: 'सेब', example: 'I like eating apples.', type: 'Food' },
        { word: 'Friend', roman: 'Dost', meaning: 'दोस्त', example: 'He is my best friend.', type: 'People' },
        { word: 'Home', roman: 'Ghar', meaning: 'घर', example: 'My home is beautiful.', type: 'Places' },
        { word: 'Water', roman: 'Paani', meaning: 'पानी', example: 'Please give me some water.', type: 'Basic' },
        { word: 'Thank you', roman: 'Dhanyavaad', meaning: 'धन्यवाद', example: 'Thank you for your help.', type: 'Common' }
    ],
    'Spanish': [
        { word: 'Hola', roman: 'Hello', meaning: 'Hello', example: '¡Hola! ¿Cómo estás?', type: 'Greeting' },
        { word: 'Gracias', roman: 'Thank you', meaning: 'Thank you', example: 'Muchas gracias por todo.', type: 'Common' },
        { word: 'Amigo', roman: 'Friend', meaning: 'Friend', example: 'Él es mi mejor amigo.', type: 'People' },
        { word: 'Casa', roman: 'House', meaning: 'Home / House', example: 'Mi casa es su casa.', type: 'Places' },
        { word: 'Agua', roman: 'Water', meaning: 'Water', example: 'Necesito beber agua.', type: 'Food/Drink' }
    ],
    'French': [
        { word: 'Bonjour', roman: 'Hello', meaning: 'Hello / Good morning', example: 'Bonjour, comment ça va?', type: 'Greeting' },
        { word: 'Merci', roman: 'Thank you', meaning: 'Thank you', example: 'Merci beaucoup, madame.', type: 'Common' },
        { word: 'Ami', roman: 'Friend', meaning: 'Friend', example: 'C\'est mon meilleur ami.', type: 'People' },
        { word: 'Maison', roman: 'House', meaning: 'Home / House', example: 'Ma maison est grande.', type: 'Places' },
        { word: 'Eau', roman: 'Water', meaning: 'Water', example: 'Je voudrais de l\'eau.', type: 'Food/Drink' }
    ],
    'Japanese': [
        { word: 'こんにちは', roman: 'Konnichiwa', meaning: 'Hello / Good afternoon', example: 'こんにちは、元気ですか？', type: 'Greeting' },
        { word: 'ありがとう', roman: 'Arigatou', meaning: 'Thank you', example: 'どうもありがとうございます。', type: 'Common' },
        { word: 'なまえ', roman: 'Namae', meaning: 'Name', example: 'わたしの名前は田中です。', type: 'People' },
        { word: 'いえ', roman: 'Ie', meaning: 'Home / House', example: '新しい家を買いました。', type: 'Places' },
        { word: 'みず', roman: 'Mizu', meaning: 'Water', example: '水を飲みたいです。', type: 'Food/Drink' }
    ]
};

// LANG_TTS_MAP moved to speechUtils.js

const LANG_CODE_MAP = {
    'Hindi': 'hi',
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'Japanese': 'ja'
};

function Dictionary() {
    const { currentCourse } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');

    const langName = currentCourse?.language || 'Hindi';
    const dictionaryPool = MULTI_LANG_DICTIONARY[langName] || MULTI_LANG_DICTIONARY['Hindi'];

    const filteredWords = dictionaryPool.filter(item =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roman.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSpeak = useCallback((text) => {
        speak(text, langName, 0.9);
    }, [langName]);

    const handleGoogleTranslate = () => {
        const query = encodeURIComponent(searchTerm || `${langName} words`);
        const sl = LANG_CODE_MAP[langName] || 'hi';
        const tl = sl === 'en' ? 'hi' : 'en';
        window.open(`https://translate.google.com/?sl=${sl}&tl=${tl}&text=${query}&op=translate`, '_blank');
    };

    return (
        <div className="dictionary-container">
            <header className="dictionary-header">
                <h1>📖 {langName} Dictionary</h1>
                <p>Explore {langName} vocabulary, meanings, and examples with pronunciation.</p>

                <div className="search-box-wrapper">
                    <div className="search-input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={`Search in ${langName}, English or Roman...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="dictionary-content">
                {filteredWords.length > 0 ? (
                    <div className="dictionary-grid">
                        {filteredWords.map((item, index) => (
                            <div key={index} className="word-card">
                                <div className="word-header">
                                    <div className="word-main">
                                        <h3>{item.word}</h3>
                                        <span className="roman-text">{item.roman}</span>
                                    </div>
                                    <div className="word-actions">
                                        <button className="speak-btn-sm" onClick={() => handleSpeak(item.word)} title="Listen to pronunciation">
                                            🔊 <span className="btn-label">Listen</span>
                                        </button>
                                        <span className="word-tag">{item.type}</span>
                                    </div>
                                </div>
                                <div className="word-body">
                                    <div className="meaning-section">
                                        <label>Meaning</label>
                                        <p>{item.meaning}</p>
                                    </div>
                                    <div className="example-section" onClick={() => handleSpeak(item.example)} style={{ cursor: 'pointer' }}>
                                        <label>Example (Tap to listen)</label>
                                        <p>"{item.example}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <div className="empty-icon">🔎</div>
                        <h3>No matches found for "{searchTerm}"</h3>
                        <p>Search directly on Google Translate for more results.</p>
                        <button className="btn-google-translate" onClick={handleGoogleTranslate}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="G" />
                            Search on Google Translate
                        </button>
                    </div>
                )}
            </div>

            {filteredWords.length > 0 && searchTerm && (
                <div className="dictionary-footer-hint">
                    <p>Not finding what you need?
                        <button className="link-btn" onClick={handleGoogleTranslate}>Try Google Translate</button>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Dictionary;
