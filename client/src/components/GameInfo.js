import React from 'react';

function GameInfo({ playerName, attempts, codeLength, difficulty, timer, formatTime, onHint, hintUsed, hint }) {
  return (
    <div className="game-info">
      <h2>Welcome, {playerName}!</h2>
      <p>Attempts: {attempts}</p>
      <p>Code Length: {codeLength}</p>
      <p>Difficulty: {difficulty === 'easy' ? 'Easy (no duplicates)' : 'Hard (duplicates allowed)'}</p>
      <p>Time: {formatTime(timer)}</p>
      <button onClick={onHint} disabled={hintUsed} style={{ marginTop: 8 }}>
        {hintUsed ? 'Hint Used' : 'Get Hint'}
      </button>
      {hint && (
        <div style={{ marginTop: 6 }}>
          <strong>Hint:</strong> Position {hint.pos + 1} is <span style={{ textTransform: 'capitalize' }}>{hint.color}</span>
        </div>
      )}
    </div>
  );
}
export default GameInfo;
