import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Letters.css';
import { speak as globalSpeak } from './utils/speechUtils';

// LANG_VOICE_MAP moved to speechUtils.js (LANG_TTS_MAP)

const LETTERS_DETAILS = {
    'Hindi': {
        title: "Hindi Script (Varnamala)",
        description: "Explore the beautiful sounds of the Devanagari script. Click any letter to hear its sound.",
        groups: [
            {
                name: "Vowels (Swar)",
                letters: [
                    { char: 'अ', sounds: 'a', example: 'Apple' },
                    { char: 'आ', sounds: 'aa', example: 'After' },
                    { char: 'इ', sounds: 'i', example: 'It' },
                    { char: 'ई', sounds: 'ee', example: 'Eat' },
                    { char: 'उ', sounds: 'u', example: 'Put' },
                    { char: 'ऊ', sounds: 'oo', example: 'Boot' },
                    { char: 'ए', sounds: 'e', example: 'Egg' },
                    { char: 'ऐ', sounds: 'ai', example: 'Ant' },
                    { char: 'ओ', sounds: 'o', example: 'Old' },
                    { char: 'औ', sounds: 'au', example: 'Out' },
                ]
            },
            {
                name: "Consonants (Vyanjan)",
                letters: [
                    { char: 'क', sounds: 'ka', example: 'Kite' },
                    { char: 'ख', sounds: 'kha', example: 'Khan' },
                    { char: 'ग', sounds: 'ga', example: 'Go' },
                    { char: 'घ', sounds: 'gha', example: 'Ghost' },
                    { char: 'च', sounds: 'cha', example: 'Chair' },
                    { char: 'छ', sounds: 'chha', example: 'Match' },
                    { char: 'ज', sounds: 'ja', example: 'Jump' },
                    { char: 'झ', sounds: 'jha', example: 'Jha (Aspirated J)' },
                ]
            }
        ]
    },
    'English': {
        title: "English Alphabet",
        description: "Master the 26 letters of the English language. Hinglish context helps you relate sounds easily.",
        groups: [
            {
                name: "Vowels (स्वर)",
                letters: [
                    { char: 'A', sounds: 'ए (ae)', example: 'Apple (सेब)' },
                    { char: 'E', sounds: 'ई (ee)', example: 'Egg (अंडा)' },
                    { char: 'I', sounds: 'आई (ai)', example: 'Ice (बर्फ)' },
                    { char: 'O', sounds: 'ओ (o)', example: 'Owl (उल्लू)' },
                    { char: 'U', sounds: 'यू (yu)', example: 'Umbrella (छाता)' }
                ]
            },
            {
                name: "Consonants (व्यंजन)",
                letters: [
                    { char: 'B', sounds: 'बी (bi)', example: 'Boy (लड़का)' },
                    { char: 'C', sounds: 'सी (si)', example: 'Cat (बिल्ली)' },
                    { char: 'D', sounds: 'डी (di)', example: 'Dog (कुत्ता)' },
                    { char: 'F', sounds: 'एफ (ef)', example: 'Fish (मछली)' },
                    { char: 'G', sounds: 'जी (ji)', example: 'Go (जाना)' },
                    { char: 'H', sounds: 'एच (ec)', example: 'Hat (टोपी)' },
                    { char: 'J', sounds: 'जे (je)', example: 'Jam (जैम)' },
                    { char: 'K', sounds: 'के (ke)', example: 'Kite (पतंग)' },
                    { char: 'L', sounds: 'एल (el)', example: 'Leaf (पत्ता)' },
                    { char: 'M', sounds: 'एम (em)', example: 'Moon (चाँद)' },
                    { char: 'N', sounds: 'एन (en)', example: 'Net (जाल)' },
                    { char: 'P', sounds: 'पी (pi)', example: 'Pen (कलम)' }
                ]
            }
        ]
    },
    'Spanish': {
        title: "Abecedario Español",
        description: "Discover the unique sounds of the Spanish alphabet. English context for easier learning.",
        groups: [
            {
                name: "Standard Letters",
                letters: [
                    { char: 'A', sounds: 'ah', example: 'Amigo (Friend)' },
                    { char: 'B', sounds: 'be', example: 'Bueno (Good)' },
                    { char: 'C', sounds: 'ce', example: 'Casa (House)' },
                    { char: 'D', sounds: 'de', example: 'Día (Day)' }
                ]
            },
            {
                name: "Special Characters",
                letters: [
                    { char: 'Ñ', sounds: 'nye', example: 'Mañana (Morning/Tomorrow)' },
                    { char: 'LL', sounds: 'ye', example: 'Pollo (Chicken)' },
                    { char: 'RR', sounds: 'trilled r', example: 'Perro (Dog)' }
                ]
            }
        ]
    },
    'French': {
        title: "Alphabet Français",
        description: "Explore French letters and accents. English translations provided.",
        groups: [
            {
                name: "Vowels & Accents",
                letters: [
                    { char: 'A', sounds: 'ah', example: 'Ami (Friend)' },
                    { char: 'É', sounds: 'ay', example: 'Été (Summer)' },
                    { char: 'È', sounds: 'eh', example: 'Père (Father)' },
                    { char: 'Ç', sounds: 'ss', example: 'Garçon (Boy)' }
                ]
            },
            {
                name: "Consonants",
                letters: [
                    { char: 'B', sounds: 'be', example: 'Bonjour (Hello)' },
                    { char: 'C', sounds: 'se/ke', example: 'Ciel (Sky)' },
                    { char: 'D', sounds: 'de', example: 'Dans (In)' }
                ]
            }
        ]
    },
    'Japanese': {
        title: "ひらがな (Hiragana)",
        description: "Discover the foundational script of Japanese. English context for easier learning.",
        groups: [
            {
                name: "Vowels",
                letters: [
                    { char: 'あ', sounds: 'a', example: 'Apple (A)' },
                    { char: 'い', sounds: 'i', example: 'Ink (I)' },
                    { char: 'う', sounds: 'u', example: 'Utah (U)' },
                    { char: 'え', sounds: 'e', example: 'Entry (E)' },
                    { char: 'お', sounds: 'o', example: 'Old (O)' }
                ]
            },
            {
                name: "K-Series",
                letters: [
                    { char: 'か', sounds: 'ka', example: 'Kafka (Ka)' },
                    { char: 'き', sounds: 'ki', example: 'King (Ki)' },
                    { char: 'く', sounds: 'ku', example: 'Cuckoo (Ku)' },
                    { char: 'け', sounds: 'ke', example: 'Kettle (Ke)' },
                    { char: 'こ', sounds: 'ko', example: 'Korea (Ko)' }
                ]
            }
        ]
    }
};

function Letters() {
    const { currentCourse } = useOutletContext();
    const langName = currentCourse?.language || 'Hindi';
    const data = LETTERS_DETAILS[langName] || LETTERS_DETAILS['Hindi'];

    const speak = useCallback((text) => {
        globalSpeak(text, langName, 0.9);
    }, [langName]);

    return (
        <div className="letters-page">
            <header className="letters-header">
                <div className="glass-card header-content">
                    <h1>{data.title}</h1>
                    <p>{data.description}</p>
                </div>
            </header>

            <div className="letters-content">
                {data.groups.map((group, gIdx) => (
                    <section key={gIdx} className="letter-group">
                        <h2 className="group-title">{group.name}</h2>
                        <div className="letters-grid-fluid">
                            {group.letters.map((item, lIdx) => (
                                <div
                                    key={lIdx}
                                    className="letter-card-premium"
                                    onClick={() => speak(item.char)}
                                    title={`Click to hear "${item.char}"`}
                                >
                                    <div className="letter-char">{item.char}</div>
                                    <div className="letter-info-overlay">
                                        <span className="sound">{item.sounds}</span>
                                        <span className="example">"{item.example}"</span>
                                    </div>
                                    <div className="voice-indicator">🔊</div>
                                    <div className="card-glow"></div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default Letters;

