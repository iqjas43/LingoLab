import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSetup = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('');

  const languages = [
    { id: 'hindi', name: 'Hindi', emoji: '🇮🇳', active: true },
    { id: 'english', name: 'English', emoji: '🇺🇸', active: true },
    { id: 'spanish', name: 'Español', emoji: '🇪🇸', active: true },
    { id: 'french', name: 'Français', emoji: '🇫🇷', active: true },
    { id: 'japanese', name: '日本語', emoji: '🇯🇵', active: true },
  ];

  const intensities = ['Casual', 'Regular', 'Serious', 'Insane'];

  const handleFinishSetup = () => {
    if (selectedLanguage && selectedIntensity) {
      localStorage.setItem('selectedLanguage', selectedLanguage);
      localStorage.setItem('selectedIntensity', selectedIntensity);
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 45px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: '800',
          background: 'linear-gradient(45deg, #fff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          LinguaFlow
        </h1>

        {/* Language Selection */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
            Choose your language
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr)', gap: '15px' }}>
            {languages.map(lang => (
              <div
                key={lang.id}
                style={{
                  background: lang.active ? '#10b981' : 'rgba(255,255,255,0.1)',
                  border: selectedLanguage === lang.id ? '3px solid #34d399' : '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '20px',
                  padding: '20px 10px',
                  textAlign: 'center',
                  cursor: lang.active ? 'pointer' : 'not-allowed',
                  opacity: lang.active ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  transform: selectedLanguage === lang.id ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => lang.active && setSelectedLanguage(lang.id)}
              >
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>{lang.emoji}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{lang.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Intensity Selection */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
            Choose intensity
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {intensities.map((intensity, index) => (
              <div
                key={intensity}
                style={{
                  background: selectedIntensity === intensity ? '#10b981' : 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '15px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
                onClick={() => setSelectedIntensity(intensity)}
              >
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>
                  {index === 0 ? '😌' : index === 1 ? '⚡' : index === 2 ? '🔥' : '🚀'}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{intensity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Finish Button */}
        <button
          onClick={handleFinishSetup}
          disabled={!selectedLanguage || !selectedIntensity}
          style={{
            width: '100%',
            background: selectedLanguage && selectedIntensity ? '#10b981' : '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '18px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: selectedLanguage && selectedIntensity ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(16,185,129,0.4)'
          }}
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default LanguageSetup;
