import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { color:'pink',   icon:'📝', title:'Interactive Problems', desc:'Solve curated coding problems with real-time feedback and automated test case evaluation.' },
    { color:'purple', icon:'🎥', title:'Video Editorials',      desc:'Expert walkthroughs explaining optimal approaches with step-by-step reasoning.' },
    { color:'cyan',   icon:'🤖', title:'AI Interview Coach',    desc:'Practice mock interviews with AI that gives instant, contextual feedback.' },
    { color:'green',  icon:'📊', title:'Algorithm Visualizer',  desc:'Watch algorithms come to life with interactive, step-by-step animations.' },
    { color:'amber',  icon:'🗺️', title:'Personalized Roadmaps', desc:'AI-generated learning paths tailored to your target company and skill gaps.' },
    { color:'indigo', icon:'🎯', title:'Spaced Repetition',     desc:'Smart review scheduling that resurfaces problems right when you need them.' },
  ];

  return (
    <div className="lp-root">

      {/* ── NAVBAR ── */}
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <span className="lp-nav__logo">CodeArena</span>
        <div className="lp-nav__links">
          <a href="#features" className="lp-nav__link">Features</a>
          <a href="#how"      className="lp-nav__link">How It Works</a>
          <a href="#showcase" className="lp-nav__link">Showcase</a>
        </div>
        <div className="lp-nav__actions">
          <button className="lp-nav__signin" onClick={() => navigate('/login')}>Sign In</button>
          <button className="lp-nav__cta"    onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero__grid" aria-hidden="true" />
        <div className="lp-hero__orb lp-hero__orb--1" aria-hidden="true" />
        <div className="lp-hero__orb lp-hero__orb--2" aria-hidden="true" />

        <div className="lp-hero__content">
          <div className="lp-hero__badge">
            <span className="lp-hero__badge-dot" aria-hidden="true" />
            The all-in-one coding interview platform
          </div>

          <h1 className="lp-hero__title">
            Master Algorithms,
            <span className="lp-hero__title-accent">Ace Your Interviews</span>
          </h1>

          <p className="lp-hero__sub">
            Practice curated problems, visualize data structures, get AI coaching,
            and track your progress — everything you need to land your <strong>dream job</strong>.
          </p>

          <div className="lp-hero__actions">
            <button className="lp-btn-primary" onClick={() => navigate('/signup')}>
              Get Started Free
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="lp-btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lp-stats">
        <div className="lp-stats__inner">
          <div><div className="lp-stats__num lp-stats__num--pink">500+</div><div className="lp-stats__desc">Coding Problems</div></div>
          <div><div className="lp-stats__num lp-stats__num--purple">50K+</div><div className="lp-stats__desc">Active Users</div></div>
          <div><div className="lp-stats__num lp-stats__num--cyan">10K+</div><div className="lp-stats__desc">Success Stories</div></div>
          <div><div className="lp-stats__num lp-stats__num--green">95%</div><div className="lp-stats__desc">Interview Success</div></div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-features">
        <div className="lp-section-header">
          <div className="lp-section-pill">✨ Features</div>
          <h2 className="lp-section-title">Everything you need to <span className="lp-section-accent">succeed</span></h2>
          <p className="lp-section-sub">Comprehensive tools designed to help you master algorithms and prepare for technical interviews at top companies.</p>
        </div>
        <div className="lp-features__grid">
          {features.map((f) => (
            <div key={f.title} className="lp-feature-card" data-c={f.color}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOWCASE ── */}
      <section id="showcase" className="lp-showcase">
        <div className="lp-showcase__text">
          <h2 className="lp-showcase__title">Code with Confidence</h2>
          <p className="lp-showcase__desc">
            Our powerful editor features syntax highlighting, multiple language support,
            and instant test execution so you always know where you stand.
          </p>
          <div className="lp-showcase__list">
            {[
              ['pink',   'Multi-language support (Java, Python, C++, JavaScript)'],
              ['purple', 'Real-time compilation and test case evaluation'],
              ['cyan',   'AI-powered code review and hints'],
              ['green',  'Submission history and performance tracking'],
            ].map(([c, t]) => (
              <div key={t} className="lp-showcase__item">
                <span className={`lp-showcase__check lp-showcase__check--${c}`}>✓</span>
                <span className="lp-showcase__item-text">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-editor">
          <div className="lp-editor__bar">
            <div className="lp-editor__dots">
              <div className="lp-editor__dot"/><div className="lp-editor__dot"/><div className="lp-editor__dot"/>
            </div>
            <span className="lp-editor__tab">twoSum.js</span>
          </div>
          <div className="lp-editor__body">
            {[
              <><span className="ck">function</span> <span className="cf">twoSum</span><span className="cb">(</span><span className="cp">nums</span><span className="cb">,</span> <span className="cp">target</span><span className="cb">)</span> <span className="cb">{'{'}</span></>,
              <><span className="cb">&nbsp;&nbsp;</span><span className="ck">const</span> <span className="cp">map</span> <span className="co">=</span> <span className="ck">new</span> <span className="cf">Map</span><span className="cb">()</span></>,
              <></>,
              <><span className="cb">&nbsp;&nbsp;</span><span className="ck">for</span> <span className="cb">(</span><span className="ck">let</span> <span className="cp">i</span> <span className="co">=</span> <span className="cn">0</span><span className="cb">;</span> <span className="cp">i</span> <span className="co">&lt;</span> <span className="cp">nums</span><span className="cb">.</span><span className="cp">length</span><span className="cb">;</span> <span className="cp">i</span><span className="co">++</span><span className="cb">)</span> <span className="cb">{'{'}</span></>,
              <><span className="cb">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="ck">const</span> <span className="cp">comp</span> <span className="co">=</span> <span className="cp">target</span> <span className="co">-</span> <span className="cp">nums</span><span className="cb">[</span><span className="cp">i</span><span className="cb">]</span></>,
              <><span className="cb">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="ck">if</span> <span className="cb">(</span><span className="cp">map</span><span className="cb">.</span><span className="cf">has</span><span className="cb">(</span><span className="cp">comp</span><span className="cb">))</span> <span className="ck">return</span> <span className="cb">[</span><span className="cp">map</span><span className="cb">.</span><span className="cf">get</span><span className="cb">(</span><span className="cp">comp</span><span className="cb">),</span> <span className="cp">i</span><span className="cb">]</span></>,
              <><span className="cb">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="cp">map</span><span className="cb">.</span><span className="cf">set</span><span className="cb">(</span><span className="cp">nums</span><span className="cb">[</span><span className="cp">i</span><span className="cb">],</span> <span className="cp">i</span><span className="cb">)</span></>,
              <><span className="cb">&nbsp;&nbsp;{'}'}</span></>,
              <><span className="cb">{'}'}</span></>,
            ].map((content, i) => (
              <div key={i} className="lp-editor__line">
                <span className="lp-editor__ln">{i + 1}</span>
                <span className="lp-editor__code">{content}</span>
              </div>
            ))}
          </div>
          <div className="lp-editor__result">
            <span className="lp-editor__result-icon">✓</span>
            <span className="lp-editor__result-label">Accepted!</span>
            <span className="lp-editor__result-meta">Runtime: 56ms · Memory: 42.1MB</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-how">
        <div className="lp-how__inner">
          <div className="lp-section-header">
            <div className="lp-section-pill">📚 Getting Started</div>
            <h2 className="lp-section-title">Start in <span className="lp-section-accent">3 simple steps</span></h2>
          </div>
          <div className="lp-how__steps">
            {[
              { n:'1', title:'Create Account', desc:'Sign up in under a minute with email or Google.' },
              { n:'2', title:'Choose Problems', desc:'Browse curated problems or follow a structured roadmap.' },
              { n:'3', title:'Get Hired',       desc:'Master algorithms and land your dream job with AI coaching.' },
            ].map((s) => (
              <div key={s.n} className="lp-how__step">
                <div className="lp-how__num">{s.n}</div>
                <h3 className="lp-how__step-title">{s.title}</h3>
                <p className="lp-how__step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta__inner">
          <h2 className="lp-cta__title">Ready to level up your coding?</h2>
          <p className="lp-cta__desc">Join thousands of developers who've already started their journey. Free forever — no credit card required.</p>
          <button className="lp-btn-primary" onClick={() => navigate('/signup')} style={{ fontSize:'1rem', padding:'13px 32px' }}>
            Get Started Free
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p className="lp-cta__note">✨ Join our community of 50K+ developers</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <span className="lp-footer__logo">CodeArena</span>
        <div className="lp-footer__links">
          <a href="#features" className="lp-footer__link">Features</a>
          <a href="#showcase" className="lp-footer__link">Showcase</a>
          <a href="#how"      className="lp-footer__link">How It Works</a>
          <a href="/login"    className="lp-footer__link">Sign In</a>
        </div>
        <span className="lp-footer__copy">© 2024 CodeArena. All rights reserved.</span>
      </footer>
    </div>
  );
}
