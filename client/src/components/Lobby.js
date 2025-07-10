import React, { useState } from 'react';
import './Lobby.css';

const GAME_EMOJIS = ['🟥', '🟦', '🟩', '🟪', '🟨', '🟧', '🟫', '🩷'];

const Lobby = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onStartGame(playerName.trim());
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h2>
          Welcome to Block-Lock!{' '}
          <span style={{ fontSize: '1.5rem', verticalAlign: 'middle' }}>🔒</span>
        </h2>
        <p className="lobby-description">
          <span style={{ fontSize: '1.2em', fontWeight: 600 }}>
            Crack the secret color code!
          </span>
          <br />
          <span style={{ opacity: 0.8 }}>
            Choose your name and get ready to test your logic and deduction skills.<br />
            Each round, a code of colored blocks is randomly generated. Your mission: guess the exact sequence using as few attempts as possible!
          </span>
        </p>
        <div style={{ margin: '1.2em 0', fontSize: '1.6rem' }}>
          {GAME_EMOJIS.map((e, i) => (
            <span key={i} style={{ margin: '0 2px' }}>{e}</span>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="lobby-form" autoComplete="off">
          <div className="input-group">
            <label htmlFor="playerName">Enter your name:</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="start-game-btn"
            disabled={!playerName.trim() || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Start Game'
            )}
          </button>
        </form>
        <div className="game-rules">
          <h3>How to Play:</h3>
          <ul>
            <li>
              <b>🎨 Guess the secret sequence of colored blocks.</b>
            </li>
            <li>
              <span style={{ color: '#43a047', fontWeight: 600 }}>Green feedback</span> = Correct color in the correct position.
            </li>
            <li>
              <span style={{ color: '#fbc02d', fontWeight: 600 }}>Yellow feedback</span> = Correct color, wrong position.
            </li>
            <li>
              <span style={{ color: '#aaa', fontWeight: 600 }}>Gray feedback</span> = Color not in the code.
            </li>
            <li>
              Use deduction and logic to solve the code in as few attempts as possible!
            </li>
            <li>
              <span role="img" aria-label="trophy">🏆</span> Try different code lengths and difficulties for a new challenge every time!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
