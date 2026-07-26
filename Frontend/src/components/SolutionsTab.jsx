import { useState } from 'react';
import './SolutionsTab.css';

const SolutionsTab = ({ solutions }) => {
  const [activeLang, setActiveLang] = useState(solutions?.[0]?.language || '');
  const [copied, setCopied] = useState(false);

  if (!solutions || solutions.length === 0) {
    return (
      <div className="empty-state-problem">
        <div className="icon">🔒</div>
        <p>Solve the problem to unlock solutions</p>
      </div>
    );
  }

  // Ensure activeLang is valid, otherwise fallback to first solution
  const activeSolution = solutions.find(s => s.language === activeLang) || solutions[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSolution.completeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageIcon = (lang) => {
    const l = lang.toLowerCase();
    if (l.includes('c++') || l.includes('cpp')) return '⚡';
    if (l.includes('java')) return '☕';
    if (l.includes('javascript') || l.includes('js')) return '🟨';
    if (l.includes('python')) return '🐍';
    return '💻';
  };

  return (
    <div className="solutions-container">
      <div className="solutions-header">
        <h3 className="solutions-title">Reference Solutions</h3>
        <p className="solutions-subtitle">Explore optimal approaches in various languages</p>
      </div>
      
      <div className="solutions-tabs-wrapper">
        {solutions.map(sol => (
          <button 
            key={sol.language}
            className={`sol-lang-btn ${activeSolution.language === sol.language ? 'active' : ''}`}
            onClick={() => setActiveLang(sol.language)}
          >
            <span className="sol-lang-icon">{getLanguageIcon(sol.language)}</span>
            {sol.language}
          </button>
        ))}
      </div>

      <div className="solution-code-container">
        <div className="solution-code-header">
          <div className="solution-code-info">
            <span className="sol-lang-icon">{getLanguageIcon(activeSolution.language)}</span>
            <span>{activeSolution.language} Implementation</span>
          </div>
          <button className={`copy-code-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
        </div>
        <div className="solution-code-scrollable">
          <pre className="solution-pre">
            <code>{activeSolution.completeCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SolutionsTab;
