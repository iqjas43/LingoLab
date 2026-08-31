import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import './Library.css';

const LIBRARY_DATA = {
    hindi: {
        pdfUrl: "/assets/docs/study-guide.pdf.pdf",
        summaries: [
            {
                chapter: "Unit 1",
                topic: "Basic Identifications",
                patterns: ["यह (X) है।", "यह क्या है?"],
                rituals: [
                    { name: "Greeting", text: "नमस्ते (Namaste)", context: "General hello" },
                    { name: "Morning", text: "शुभ प्रभात (Shubh Prabhaat)", context: "Good Morning" }
                ],
                pdfPage: 13,
                icon: "👋"
            },
            {
                chapter: "Unit 2",
                topic: "Greetings & People",
                patterns: ["मेरा नाम (X) है।", "आप कैसे हैं?"],
                rituals: [
                    { name: "Inquiry", text: "आपका नाम क्या है? (Aapka naam kya hai?)", context: "What is your name?" },
                    { name: "Response", text: "मैं ठीक हूँ (Main theek hoon)", context: "I am fine" }
                ],
                pdfPage: 25,
                icon: "👤"
            },
            {
                chapter: "Unit 3",
                topic: "Family & Home",
                patterns: ["मेरा (X) यहाँ है।", "यह मेरा (X) है।"],
                rituals: [
                    { name: "Introduction", text: "ये मेरे पिताजी हैं (Ye mere pitaji hain)", context: "Introducing family" },
                    { name: "Possession", text: "मेरा घर (Mera ghar)", context: "My house" }
                ],
                pdfPage: 42,
                icon: "🏠"
            },
            {
                chapter: "Unit 4",
                topic: "Numbers & Shopping",
                patterns: ["(X) का दाम क्या है?", "(X) रुपये।"],
                rituals: [
                    { name: "Price Check", text: "कितने पैसे हुए? (Kitne paise hue?)", context: "Asking for the bill" },
                    { name: "Quantity", text: "एक किलो... (Ek kilo...)", context: "Buying by weight" }
                ],
                pdfPage: 58,
                icon: "💰"
            }
        ]
    },
    spanish: {
        pdfUrl: "/assets/docs/spanish-guide.pdf..pdf",
        summaries: [
            {
                chapter: "Unit 1",
                topic: "Greetings & Basics",
                patterns: ["¡Hola!", "Me llamo (X).", "¿Cómo te llamas?"],
                rituals: [
                    { name: "Morning", text: "Buenos días", context: "Good morning" },
                    { name: "Inquiry", text: "¿Cómo estás?", context: "How are you?" }
                ],
                pdfPage: 1,
                icon: "👋"
            },
            {
                chapter: "Unit 2",
                topic: "Essential Verbs (Ser/Estar)",
                patterns: ["Yo soy (X).", "Yo estoy (X)."],
                rituals: [
                    { name: "Origin", text: "Soy de España", context: "I am from Spain (Permanent)" },
                    { name: "Mood", text: "Estoy feliz", context: "I am happy (Temporary)" }
                ],
                pdfPage: 5,
                icon: "⚖️"
            },
            {
                chapter: "Unit 3",
                topic: "Personal Intro",
                patterns: ["Soy de (Country).", "Tengo (X) años."],
                rituals: [
                    { name: "Introduction", text: "Mucho gusto", context: "Nice to meet you" },
                    { name: "Age", text: "¿Cuántos años tienes?", context: "How old are you?" }
                ],
                pdfPage: 10,
                icon: "👤"
            }
        ]
    },
    english: {
        pdfUrl: "/assets/docs/english-guide.pdf..pdf",
        summaries: [
            {
                chapter: "Unit 1",
                topic: "Greetings",
                patterns: ["Hello, I am (X).", "Hi, nice to meet you."],
                rituals: [
                    { name: "Morning", text: "Good Morning", context: "Start of the day" },
                    { name: "Welcome", text: "Welcome!", context: "Welcoming someone" }
                ],
                pdfPage: 1,
                icon: "👋"
            },
            {
                chapter: "Unit 2",
                topic: "Meeting People",
                patterns: ["What is your name?", "I am from (X)."],
                rituals: [
                    { name: "Inquiry", text: "How are you?", context: "Checking in" },
                    { name: "Response", text: "I am fine, thank you.", context: "Common reply" }
                ],
                pdfPage: 3,
                icon: "🤝"
            },
            {
                chapter: "Unit 3",
                topic: "Polite Expressions",
                patterns: ["Please", "Thank you", "Excuse me"],
                rituals: [
                    { name: "Request", text: "Can you help me?", context: "Asking for help" },
                    { name: "Gratitude", text: "I appreciate it.", context: "Showing thanks" }
                ],
                pdfPage: 7,
                icon: "🙏"
            }
        ]
    },
    french: {
        pdfUrl: "/assets/docs/french-guide.pdf",
        summaries: [
            {
                chapter: "Unit 1",
                topic: "Greetings",
                patterns: ["Bonjour", "Salut", "Je m'appelle (X)"],
                rituals: [
                    { name: "Greeting", text: "Bon matin", context: "Good morning" },
                    { name: "Politeness", text: "S'il vous plaît", context: "Please" }
                ],
                pdfPage: 1,
                icon: "🇫🇷"
            }
        ]
    },
    japanese: {
        pdfUrl: "/assets/docs/japanese-guide.pdf",
        summaries: [
            {
                chapter: "Unit 1",
                topic: "Greetings",
                patterns: ["こんにちは (Konnichiwa)", "はじめまして (Hajimemashite)"],
                rituals: [
                    { name: "Morning", text: "おはよう (Ohayou)", context: "Good morning" },
                    { name: "Gratitude", text: "ありがとう (Arigatou)", context: "Thank you" }
                ],
                pdfPage: 1,
                icon: "🇯🇵"
            }
        ]
    }
};

function Library() {
    const location = useLocation();
    const { currentCourse } = useOutletContext();
    const [selectedLang, setSelectedLang] = useState("hindi"); 
    const [activeTab, setActiveTab] = useState("viewer");
    const [currentPage, setCurrentPage] = useState(1);

    // Sync tab, page, and language
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get("page");
        const tab = queryParams.get("tab");
        
        // Derive language from currentCourse context instead of manual localStorage
        if (currentCourse && currentCourse.language) {
            const lang = currentCourse.language.toLowerCase();
            if (LIBRARY_DATA[lang]) {
                setSelectedLang(lang);
            }
        }

        if (tab) setActiveTab(tab);
        if (page) setCurrentPage(parseInt(page));
    }, [location.search, currentCourse]);

    const handleOpenPDF = (page) => {
        setCurrentPage(page);
        setActiveTab('viewer');
    };

    const currentData = LIBRARY_DATA[selectedLang];
    const pdfUrl = `${currentData.pdfUrl}#page=${currentPage}`;

    return (
        <div className="library-container">
            <header className="library-header">
                <div className="header-info">
                    <h1>📚 Resource Library ({selectedLang.toUpperCase()})</h1>
                    <p>Access your study guides and chapter summaries for {selectedLang}.</p>
                </div>
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'viewer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('viewer')}
                    >
                        📖 Study Guide
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'summaries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summaries')}
                    >
                        📝 Summaries
                    </button>
                </div>
            </header>

            <div className="library-content">
                {activeTab === 'viewer' && (
                    <div className="pdf-viewer-section">
                        <iframe
                            src={pdfUrl}
                            title={`${selectedLang} Study Guide`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    </div>
                )}

                {activeTab === 'summaries' && (
                    <div className="summaries-grid">
                        {currentData.summaries.map((chapter, index) => (
                            <div key={index} className="summary-card">
                                <div className="card-header">
                                    <span className="card-icon">{chapter.icon}</span>
                                    <div className="card-title-group">
                                        <span className="unit-label">{chapter.chapter}</span>
                                        <h3>{chapter.topic}</h3>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="summary-section">
                                        <h4>✨ Main Patterns</h4>
                                        <ul className="patterns-list">
                                            {chapter.patterns.map((p, i) => (
                                                <li key={i}>
                                                    <strong>{p}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="summary-section">
                                        <h4>🤝 Rituals & Phrases</h4>
                                        <ul className="rituals-list">
                                            {chapter.rituals.map((r, i) => (
                                                <li key={i}>
                                                    <div className="ritual-name">{r.name}</div>
                                                    <div className="ritual-text">{r.text}</div>
                                                    <div className="ritual-context">{r.context}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        className="btn-open-pdf"
                                        onClick={() => handleOpenPDF(chapter.pdfPage)}
                                    >
                                        📖 View on Page {chapter.pdfPage}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Library;
