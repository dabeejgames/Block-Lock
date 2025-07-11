import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Lobby from './components/Lobby';
import GuessPanel from './components/GuessPanel';
import HelpModal from './components/HelpModal';
import LeaderboardModal from './components/LeaderboardModal';
import ConfettiEffect from './components/ConfettiEffect';
import GameInfo from './components/GameInfo';
import PreviousGuesses from './components/PreviousGuesses';
import { generateCode } from './utils/generateCode';
import { generateFeedback } from './utils/generateFeedback';
import { arraysEqual } from './utils/arraysEqual';
import { formatTime } from './utils/formatTime';
import { playSound } from './utils/playSound';

const DEFAULT_COLORS = [
  { name: 'red', hex: '#e53935', pattern: 'R' },
  { name: 'blue', hex: '#1e88e5', pattern: 'B' },
  { name: 'green', hex: '#43a047', pattern: 'G' },
  { name: 'purple', hex: '#8e24aa', pattern: 'P' },
  { name: 'yellow', hex: '#fbc02d', pattern: 'Y' },
  { name: 'orange', hex: '#fb8c00', pattern: 'O' },
  { name: 'pink', hex: '#ff69b4', pattern: 'Pi' }, // lighter pink
  { name: 'brown', hex: '#6d4c41', pattern: 'Br' }
];

const minCodeLength = 4;
const maxCodeLength = 7;

function App() {
  const [gameState, setGameState] = useState('lobby');
  const [playerName, setPlayerName] = useState('');
  const [codeLength, setCodeLength] = useState(4);
  const [difficulty, setDifficulty] = useState('easy');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColors, setSelectedColors] = useState(DEFAULT_COLORS.slice(0, 6));
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill(''));
  const [targetCode, setTargetCode] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hint, setHint] = useState(null);
  const [leaderboard, setLeaderboard] = useState(() =>
    JSON.parse(localStorage.getItem('leaderboard') || '[]')
  );
  const [theme, setTheme] = useState('default');
  const timerRef = useRef();

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const handleStartGame = (name) => {
    setPlayerName(name);
    setGameState('setup');
  };

  const handleSetup = () => {
    const code = generateCode({ codeLength, colors: selectedColors.map(c => c.name), difficulty });
    setTargetCode(code);
    setCurrentGuess(Array(codeLength).fill(''));
    setLatestFeedback(null);
    setAttempts(0);
    setGuesses([]);
    setHintUsed(false);
    setHint(null);
    setTimer(0);
    setTimerActive(true);
    setGameState('playing');
    setShowConfetti(false);
  };

  const submitGuess = (guessArr) => {
    if (guessArr.length !== codeLength || guessArr.some(c => !c)) return;
    const feedback = generateFeedback(guessArr, targetCode);
    setLatestFeedback(feedback);
    setAttempts(prev => prev + 1);
    setGuesses(prev => [
      ...prev,
      { code: [...guessArr], feedback }
    ]);
    playSound(feedback.correct === codeLength ? 'win' : 'guess');

    if (arraysEqual(guessArr, targetCode)) {
      setGameState('finished');
      setTimerActive(false);
      setShowConfetti(true);
      const entry = {
        name: playerName,
        attempts: attempts + 1,
        time: timer,
        codeLength,
        difficulty,
        date: new Date().toLocaleString()
      };
      const updated = [...leaderboard, entry].sort((a, b) => a.attempts - b.attempts || a.time - b.time).slice(0, 10);
      setLeaderboard(updated);
      localStorage.setItem('leaderboard', JSON.stringify(updated));
    }
    setCurrentGuess(Array(codeLength).fill(''));
  };

  const resetGame = () => {
    setGameState('lobby');
    setPlayerName('');
    setCurrentGuess(Array(codeLength).fill(''));
    setTargetCode([]);
    setLatestFeedback(null);
    setAttempts(0);
    setGuesses([]);
    setCodeLength(4);
    setDifficulty('easy');
    setTimer(0);
    setTimerActive(false);
    setHintUsed(false);
    setHint(null);
    setShowConfetti(false);
  };

  const handleHint = () => {
    if (hintUsed) return;
    for (let i = 0; i < codeLength; i++) {
      if (currentGuess[i] !== targetCode[i]) {
        setHint({ pos: i, color: targetCode[i] });
        setHintUsed(true);
        break;
      }
    }
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => {
      if (prev.find(c => c.name === color.name)) {
        if (prev.length <= codeLength) return prev;
        return prev.filter(c => c.name !== color.name);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className={`App${darkMode ? ' dark' : ''} theme-${theme}`}>
      <header className="App-header">
        <h1>🔒 Block-Lock</h1>
        <button className="help-btn" onClick={() => setShowHelp(true)} aria-label="Show help">?</button>
        <button className="leaderboard-btn" onClick={() => setShowLeaderboard(true)} aria-label="Show leaderboard">🏆</button>
        <button className="dark-btn" onClick={() => setDarkMode(d => !d)} aria-label="Toggle dark mode">
          {darkMode ? '🌙' : '☀️'}
        </button>
        <button className="cb-btn" onClick={() => setColorBlindMode(cb => !cb)} aria-label="Toggle color-blind mode">
          {colorBlindMode ? '👁️‍🗨️' : '👁️'}
        </button>
        <select value={theme} onChange={handleThemeChange} style={{ marginLeft: 12 }}>
          <option value="default">Default Theme</option>
          <option value="pastel">Pastel</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </header>

      <main className="App-main">
        {gameState === 'lobby' && (
          <Lobby onStartGame={handleStartGame} />
        )}

        {gameState === 'setup' && (
          <div className="setup-panel">
            <h2>Game Setup</h2>
            <label>
              Code Length:
              <select
                value={codeLength}
                onChange={e => {
                  setCodeLength(Number(e.target.value));
                  setCurrentGuess(Array(Number(e.target.value)).fill(''));
                }}
              >
                {Array.from({ length: maxCodeLength - minCodeLength + 1 }, (_, i) =>
                  minCodeLength + i
                ).map(len => (
                  <option key={len} value={len}>{len}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Difficulty:
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy (no duplicates)</option>
                <option value="hard">Hard (duplicates allowed)</option>
              </select>
            </label>
            <br />
            <label>
              Color Set:
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0.5em 0' }}>
                {DEFAULT_COLORS.map(color => (
                  <span
                    key={color.name}
                    className="color-peg"
                    style={{
                      background: color.hex,
                      border: selectedColors.find(c => c.name === color.name) ? '2px solid #444' : '2px dashed #aaa',
                      margin: '0 5px 5px 0',
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      position: 'relative',
                      opacity: selectedColors.find(c => c.name === color.name) ? 1 : 0.3,
                      cursor: 'pointer'
                    }}
                    title={color.name}
                    tabIndex={0}
                    aria-label={color.name}
                    onClick={() => handleColorToggle(color)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleColorToggle(color); }}
                  >
                    {colorBlindMode && (
                      <span className="peg-pattern" style={{
                        position: 'absolute',
                        top: 6, left: 10,
                        fontSize: 13,
                        color: '#fff',
                        textShadow: '0 0 2px #000'
                      }}>{color.pattern}</span>
                    )}
                  </span>
                ))}
              </div>
              <small>Click to select/deselect. At least as many as code length must be selected.</small>
            </label>
            <br />
            <button
              onClick={handleSetup}
              disabled={selectedColors.length < codeLength}
              className="start-game-btn"
            >Start Game</button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="game-container">
            <GameInfo
              playerName={playerName}
              attempts={attempts}
              codeLength={codeLength}
              difficulty={difficulty}
              timer={timer}
              formatTime={formatTime}
              onHint={handleHint}
              hintUsed={hintUsed}
              hint={hint}
            />
            <GuessPanel
              currentGuess={currentGuess}
              onGuessChange={setCurrentGuess}
              onSubmitGuess={submitGuess}
              colors={selectedColors}
              codeLength={codeLength}
              colorBlindMode={colorBlindMode}
              easyMode={difficulty === 'easy'}
              guesses={guesses}
            />
            {latestFeedback && (
              <div className="guess-feedback" style={{ marginTop: 10, transition: 'all 0.3s' }}>
                <strong>Feedback:</strong> {latestFeedback.correct} correct, {latestFeedback.wrongPosition} misplaced
              </div>
            )}
          </div>
        )}

        {gameState === 'finished' && (
          <div className="game-finished">
            {showConfetti && <ConfettiEffect />}
            <PreviousGuesses
              guesses={guesses}
              selectedColors={selectedColors}
              colorBlindMode={colorBlindMode}
            />
            <h2>🎉 Congratulations, {playerName}!</h2>
            <p>You cracked the code in {attempts} attempts and {formatTime(timer)}!</p>
            <p>
              The code was:{' '}
              <span>
                {targetCode.map((color, idx) => {
                  const colorObj = selectedColors.find(c => c.name === color);
                  return (
                    <span
                      key={idx}
                      className="color-peg"
                      style={{
                        background: colorObj ? colorObj.hex : '#ccc',
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        margin: '0 5px',
                        border: '2px solid #444',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        position: 'relative'
                      }}
                      title={color}
                    >
                      {colorBlindMode && colorObj && (
                        <span style={{
                          position: 'absolute',
                          top: 6, left: 10,
                          fontSize: 13,
                          color: '#fff',
                          textShadow: '0 0 2px #000'
                        }}>{colorObj.pattern}</span>
                      )}
                    </span>
                  );
                })}
              </span>
            </p>
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        )}
      </main>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showLeaderboard && <LeaderboardModal leaderboard={leaderboard} onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}

export default App;
