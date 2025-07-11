import React, { useState } from 'react';
import './App.css';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import GuessPanel from './components/GuessPanel';

function App() {
  const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange'];
  const codeLength = 4;

  const [gameState, setGameState] = useState('lobby');
  const [playerName, setPlayerName] = useState('');
  const [currentGuess, setCurrentGuess] = useState(Array(codeLength).fill(''));
  const [guesses, setGuesses] = useState([]);
  const [targetCode, setTargetCode] = useState([]);

  const startGame = (name) => {
    setPlayerName(name);
    setGameState('playing');
    const code = Array.from({ length: codeLength }, () =>
      colors[Math.floor(Math.random() * colors.length)]
    );
    setTargetCode(code);
    setGuesses([]);
    setCurrentGuess(Array(codeLength).fill(''));
  };

  const submitGuess = (guessArr) => {
    if (guessArr.length !== codeLength || guessArr.some(c => !c)) return;

    const newGuess = {
      code: guessArr,
      feedback: generateFeedback(guessArr, targetCode),
      timestamp: Date.now()
    };

    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess(Array(codeLength).fill(''));

    if (arraysEqual(guessArr, targetCode)) {
      setGameState('finished');
    }
  };

  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const generateFeedback = (guess, target) => {
    let correct = 0;
    let wrongPosition = 0;
    const targetUsed = new Array(codeLength).fill(false);
    const guessUsed = new Array(codeLength).fill(false);

    for (let i = 0; i < codeLength; i++) {
      if (guess[i] === target[i]) {
        correct++;
        targetUsed[i] = true;
        guessUsed[i] = true;
      }
    }
    for (let i = 0; i < codeLength; i++) {
      if (!guessUsed[i]) {
        for (let j = 0; j < codeLength; j++) {
          if (!targetUsed[j] && guess[i] === target[j]) {
            wrongPosition++;
            targetUsed[j] = true;
            break;
          }
        }
      }
    }
    return { correct, wrongPosition };
  };

  const resetGame = () => {
    setGameState('lobby');
    setPlayerName('');
    setCurrentGuess(Array(codeLength).fill(''));
    setGuesses([]);
    setTargetCode([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔒 Block-Lock</h1>
        <p>Crack the color code!</p>
        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontWeight: 600 }}>Colors:</span>
          {colors.map(color => (
            <span
              key={color}
              style={{
                display: 'inline-block',
                background: color,
                width: 22,
                height: 22,
                borderRadius: '50%',
                margin: '0 5px',
                border: '2px solid #444',
                verticalAlign: 'middle',
              }}
              title={color}
            ></span>
          ))}
        </div>
      </header>

      <main className="App-main">
        {gameState === 'lobby' && (
          <Lobby onStartGame={startGame} />
        )}

        {gameState === 'playing' && (
          <div className="game-container">
            <div className="game-info">
              <h2>Welcome, {playerName}!</h2>
              <p>Attempts: {guesses.length}</p>
            </div>
            {/* Only show PREVIOUS guesses here */}
            <GameBoard
              guesses={guesses}
              colors={colors}
              codeLength={codeLength}
            />
            {/* Show the "current guess" as a single line in GuessPanel */}
            <GuessPanel
              currentGuess={currentGuess}
              onGuessChange={setCurrentGuess}
              onSubmitGuess={submitGuess}
              colors={colors}
              codeLength={codeLength}
            />
          </div>
        )}

        {gameState === 'finished' && (
          <div className="game-finished">
            <h2>🎉 Congratulations, {playerName}!</h2>
            <p>You cracked the code in {guesses.length} attempts!</p>
            <p>
              The code was:{' '}
              <span>
                {targetCode.map((color, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      background: color,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      margin: '0 5px',
                      border: '2px solid #444',
                      verticalAlign: 'middle',
                    }}
                    title={color}
                  ></span>
                ))}
              </span>
            </p>
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;