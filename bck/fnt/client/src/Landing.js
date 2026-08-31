import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const languages = [
    { name: 'Hindi', flag: '🇮🇳', learners: '2.5K' },
    { name: 'Spanish', flag: '🇪🇸', learners: '1.8K' },
    { name: 'French', flag: '🇫🇷', learners: '1.2K' },
    { name: 'Japanese', flag: '🇯🇵', learners: '800' },
    { name: 'German', flag: '🇩🇪', learners: '600' },
    { name: 'Korean', flag: '🇰🇷', learners: '400' },
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">
          <div className="logo-icon">L</div>
          <span>LingoLab</span>
        </div>
        <div className="nav-links">
          <button className="btn-text" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-primary small" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <div className="badge-pill">🚀 New Way to Learn</div>
          <h1>Master Languages Through <span className="highlight-text">Play</span>, Not Drills.</h1>
          <p className="hero-subtext">
            Experience the world's most immersive, gamified language lab. Learn Hindi, Spanish, and more with real-world context and a community that has your back.
          </p>

          <div className="hero-cta">
            <button className="btn-primary large glass-effect" onClick={() => navigate('/register')}>
              Start Your Quest (Free)
            </button>
            <button className="btn-secondary large" onClick={() => navigate('/login')}>
              I Already Have an Account
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="app-mockup-container">
            {/* Subsitute for 3D visual - A glowing dashboard preview */}
            <div className="dashboard-preview">
              <div className="preview-nav"></div>
              <div className="preview-path">
                <div className="path-node active"></div>
                <div className="path-node"></div>
                <div className="path-node"></div>
                <div className="path-node locked"></div>
              </div>
              <div className="preview-sidebar"></div>
            </div>
            <div className="floating-badge badge-xp">+250 XP</div>
            <div className="floating-badge badge-streak">🔥 15 Day Streak</div>
          </div>
          <div className="glow-effect"></div>
        </div>
      </main>

      {/* 2. Social Proof/Stats */}
      <section className="stats-ticker-section">
        <div className="stats-ticker-container">
          <div className="stats-headline">Joined by a Growing Community of <span className="highlight-text">5,000+</span> Learners</div>
          <div className="stats-grid">
            <div className="stat-card glass-card">
              <span className="stat-num pulse">1,200+</span>
              <span className="stat-label">Daily Challenges</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-num pulse">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-num pulse">10+</span>
              <span className="stat-label">Languages</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Competitive Advantage (The Why) */}
      <section className="why-section">
        <div className="section-header">
          <h2>Forget Rote Memorization. <span className="highlight-text">Live the Language.</span></h2>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="huge-icon">🎮</div>
            <h3>Gamified for Growth</h3>
            <p>Earn "LingoGems", unlock avatars, and climb the leaderboard. It's not a chore; it's a game you'll never want to quit.</p>
          </div>
          <div className="why-card">
            <div className="huge-icon">🌍</div>
            <h3>Built for Reality</h3>
            <p>We don't just teach words; we teach context. Practice ordering coffee in Paris or negotiating in Delhi using AI scenarios.</p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Language Picker */}
      <section className="language-picker-section">
        <div className="section-header">
          <h2>What Will Your Next Adventure Be?</h2>
          <p>Select a language to see its unique curriculum.</p>
        </div>
        <div className="language-grid">
          {languages.map((lang, idx) => (
            <div key={idx} className="lang-card" onClick={() => navigate('/register')}>
              <span className="lang-flag">{lang.flag}</span>
              <div className="lang-info">
                <strong>{lang.name}</strong>
                <span>{lang.learners} Learners</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Feature Deep-Dive (Alternating) */}
      <section className="deep-dive-section">
        <div className="row alternating">
          <div className="row-visual">
            <div className="visual-box smart-review-bg">
              <div className="progress-bars">
                <div className="bar" style={{ width: '80%' }}></div>
                <div className="bar" style={{ width: '40%' }}></div>
                <div className="bar" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
          <div className="row-content">
            <h3>Smart Review</h3>
            <p>Never Forget Again. Our AI-driven Smart Review tracks your weakest points and brings them back right when you're about to forget them.</p>
          </div>
        </div>

        <div className="row alternating reverse">
          <div className="row-visual">
            <div className="visual-box community-bg">
              <div className="voice-wave">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <div className="row-content">
            <h3>Community Feedback</h3>
            <p>Learn from Humans, Not Just Bots. Post your voice recordings and get corrections from native speakers in our global community.</p>
          </div>
        </div>

        <div className="row alternating">
          <div className="row-visual">
            <div className="visual-box expert-bg">
              <div className="curriculum-tree">
                <div className="node">A1</div>
                <div className="connector"></div>
                <div className="node current">A2</div>
                <div className="connector"></div>
                <div className="node locked">B1</div>
              </div>
            </div>
          </div>
          <div className="row-content">
            <h3>Expert Lessons</h3>
            <p>Curated by Linguists. Every path is hand-crafted based on the CEFR framework (A1-B2) to ensure you're learning what actually matters.</p>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Success Stories from the Lab</h2>
        </div>
        <div className="testimonial-slider">
          <div className="testimonial-card glass-card">
            <p>"I tried everything, but LingoLab is the only app that kept me coming back. I finally feel confident speaking Hindi!"</p>
            <div className="user-info">
              <div className="avatar">SJ</div>
              <div>
                <strong>Sara J.</strong>
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card glass-card">
            <p>"The community feedback feature is a game-changer. Getting real corrections from natives is so helpful."</p>
            <div className="user-info">
              <div className="avatar">MK</div>
              <div>
                <strong>Mark K.</strong>
                <span>Berlin, Germany</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Web-First Experience (Replacing Mobile Teaser) */}
      <section className="web-experience-section">
        <div className="experience-container">
          <div className="experience-content">
            <div className="badge-pill">💻 Web Excellence</div>
            <h2>A Powerful Lab, <span className="highlight-text">Right in Your Browser.</span></h2>
            <p>No downloads required. Access your personalized learning path, AI feedback, and global community from any device. LingoLab is built for the modern web—fast, fluid, and always synced.</p>
            <div className="feature-tags">
              <span>⚡ Lightning Fast</span>
              <span>🔄 Real-time Sync</span>
              <span>🌐 Web-First Design</span>
            </div>
          </div>
          <div className="experience-visual">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="browser-content">
                <div className="skeleton-grid">
                  <div className="skeleton-item long"></div>
                  <div className="skeleton-item medium"></div>
                  <div className="skeleton-item short"></div>
                </div>
              </div>
            </div>
            <div className="floating-element glass-card card-desktop">💻 Desktop Mode</div>
            <div className="floating-element glass-card card-tablet">📱 Tablet Mode</div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA & Footer */}
      <section className="final-cta">
        <div className="cta-box">
          <h2>Build Your Language Legacy Today.</h2>
          <button className="btn-primary large glass-effect" onClick={() => navigate('/register')}>
            Start Learning for Free
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon small">L</div>
              <span>LingoLab</span>
            </div>
            <p>Making language learning fun, social, and accessible to everyone.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <span>Lessons</span>
              <span>Community</span>
              <span>Pricing</span>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <span>About</span>
              <span>Blog</span>
              <span>Careers</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LingoLab. Made with ❤️ by the Global Team.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

