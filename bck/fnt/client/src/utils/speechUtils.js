
let currentUtterance = null;

export const LANG_TTS_MAP = {
    'Hindi': 'hi-IN',
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Japanese': 'ja-JP',
    'German': 'de-DE'
};

/**
 * Enhanced speak function for cross-browser reliability.
 * @param {string} text - The text to speak.
 * @param {string} langName - The language name (e.g., 'Hindi').
 * @param {number} rate - The speech rate (default 0.9).
 */
export const speak = (text, langName = 'Hindi', rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('Speech synthesis not supported in this browser.');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Crucial: Maintain a global reference to prevent garbage collection
    // during the asynchronous speak process.
    currentUtterance = utterance;
    
    const langCode = LANG_TTS_MAP[langName] || 'hi-IN';
    utterance.lang = langCode;
    utterance.rate = rate;
    utterance.volume = 1.0;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === langCode) || 
                  voices.find(v => v.lang.startsWith(langCode));
    
    if (voice) {
        utterance.voice = voice;
    }

    // Small delay helps browsers clean up after cancel()
    setTimeout(() => {
        console.log(`Speaking (${langCode}): ${text.substring(0, 30)}...`);
        window.speechSynthesis.speak(utterance);
    }, 50);

    utterance.onend = () => {
        currentUtterance = null;
    };

    utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        currentUtterance = null;
    };
};

// Proactively load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}
