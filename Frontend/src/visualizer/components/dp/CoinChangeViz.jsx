import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateCoinChangeSteps, coinChangeCode, defaultCoins } from '../../algorithms/dp';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './DPViz.css';

/**
 * Coin Change Problem Visualizer
 */
const CoinChangeViz = () => {
  const [coins, setCoins] = useState(defaultCoins.coins);
  const [amount, setAmount] = useState(defaultCoins.amount);
  const [inputCoins, setInputCoins] = useState(defaultCoins.coins.join(', '));
  const [inputAmount, setInputAmount] = useState(defaultCoins.amount.toString());

  const steps = useMemo(() => {
    return generateCoinChangeSteps(coins, amount);
  }, [coins, amount]);

  const animation = useAnimation(steps, 2);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const c = inputCoins.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    const a = parseInt(inputAmount);
    
    if (c.length > 0 && a > 0 && a <= 30) {
      setCoins(c.sort((a, b) => a - b));
      setAmount(a);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter valid coins and amount (1-30)');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      simple: { coins: [1, 2, 5], amount: 11 },
      medium: { coins: [1, 3, 4], amount: 6 },
      hard: { coins: [2, 5, 10], amount: 15 }
    };
    const p = presets[preset];
    setCoins(p.coins);
    setAmount(p.amount);
    setInputCoins(p.coins.join(', '));
    setInputAmount(p.amount.toString());
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const renderCoins = () => {
    const currentCoin = currentState.currentCoin;
    const coinsUsed = currentState.coinsUsed || [];
    
    return (
      <div className="coins-display">
        {coins.map((coin, idx) => (
          <div 
            key={idx} 
            className={`coin ${currentCoin === coin ? 'active' : ''} ${coinsUsed.includes(coin) ? 'used' : ''}`}
          >
            {coin}
          </div>
        ))}
      </div>
    );
  };

  const renderDPArray = () => {
    const dp = currentState.dp || [];
    const currentAmount = currentState.currentAmount;
    const comparing = currentState.comparing;

    if (dp.length === 0) return null;

    return (
      <div className="dp-1d-container">
        <div className="dp-1d-array">
          {dp.map((val, idx) => {
            let cellClass = 'dp-1d-value';
            if (idx === currentAmount) cellClass += ' current';
            if (idx === comparing) cellClass += ' comparing';
            if (currentState.status === 'complete' && idx === amount) cellClass += ' result';
            
            return (
              <div key={idx} className="dp-1d-cell">
                <div className={cellClass}>{val}</div>
                <div className="dp-1d-index">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCoinsUsed = () => {
    const coinsUsed = currentState.coinsUsed || [];
    
    if (coinsUsed.length === 0 || currentState.status !== 'complete') return null;

    return (
      <div className="result-display">
        <span className="result-label">Coins Used:</span>
        <div className="coins-used">
          {coinsUsed.map((coin, idx) => (
            <span key={idx} className="coin-used">{coin}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="visualizer-page">
      <div className="viz-header">
        <Link to="/visualizer/dynamic-programming" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">🪙 Coin Change</h1>
          <span className="viz-tag">Dynamic Programming</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>Coins:</label>
                <input
                  type="text"
                  value={inputCoins}
                  onChange={(e) => setInputCoins(e.target.value)}
                  className="input-field"
                  placeholder="1, 2, 5"
                />
              </div>
              <div className="input-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="input-field small"
                  min="1"
                  max="30"
                />
              </div>
            </div>
            <div className="button-row">
              <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
              <div className="preset-buttons">
                <button onClick={() => handlePreset('simple')} className="btn-preset">Simple</button>
                <button onClick={() => handlePreset('medium')} className="btn-preset">Medium</button>
                <button onClick={() => handlePreset('hard')} className="btn-preset">Hard</button>
              </div>
            </div>
          </div>

          <div className="status-message">
            <span className="status-icon">
              {currentState.status === 'complete' && currentState.result !== -1 ? '✅' : 
               currentState.status === 'complete' && currentState.result === -1 ? '❌' :
               currentState.status === 'update' ? '✓' : '🪙'}
            </span>
            <span>{currentState.message || 'Ready to solve coin change'}</span>
          </div>

          {renderCoins()}
          {renderDPArray()}
          {renderCoinsUsed()}

          <AnimationControls
            isPlaying={animation.isPlaying}
            isComplete={animation.isComplete}
            currentStep={animation.currentStep}
            totalSteps={animation.totalSteps}
            progress={animation.progress}
            speed={animation.speed}
            onPlay={animation.play}
            onPause={animation.pause}
            onStepForward={animation.stepForward}
            onStepBack={animation.stepBack}
            onReset={animation.reset}
            onSpeedChange={animation.changeSpeed}
            onProgressChange={animation.goToStep}
          />
        </div>

        <div className="viz-sidebar">
          <AskTutorButton topic="Coin Change Problem" />
          <CodePanel code={coinChangeCode} currentLine={currentState.codeLine} title="Coin Change" />
          <StatePanel
            state={{
              'Coins': `[${coins.join(', ')}]`,
              'Target': amount,
              'Current Coin': currentState.currentCoin || '-',
              'Min Coins': currentState.result ?? '-'
            }}
            title="Current State"
          />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Coin Change</h3>
        <p>
          Find the minimum number of coins needed to make up a given amount. 
          Uses unbounded knapsack approach where each coin can be used multiple times.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n×amount)</span>
          <span className="badge space">Space: O(amount)</span>
          <span className="badge info">1D DP</span>
        </div>
      </div>
    </div>
  );
};

export default CoinChangeViz;
