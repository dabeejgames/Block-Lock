import React from 'react';

// Helper to get color object by name
const getColorObj = (colors, name) => colors.find(c => c.name === name);

function PreviousGuesses({ guesses, selectedColors, colorBlindMode = false }) {
  if (!guesses || guesses.length === 0) return null;

  return (
    <div className="previous-guesses" style={{ marginBottom: 18 }}>
      <strong style={{ color: '#667eea', marginBottom: 6, display: 'block' }}>Previous Guesses:</strong>
      {guesses.map((guess, i) => (
        <div key={i} className="guess-row" style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          {guess.code.map((color, idx) => {
            const colorObj = getColorObj(selectedColors, color);
            return (
              <span
                key={idx}
                className="color-preview-square"
                style={{
                  background: colorObj ? colorObj.hex : '#eee',
                  border: '2.5px solid #444',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  margin: '0 5px',
                  display: 'inline-block',
                  position: 'relative'
                }}
                title={colorObj ? colorObj.name : ''}
              >
                {colorBlindMode && colorObj && (
                  <span style={{
                    position: 'absolute',
                    top: 7,
                    left: 10,
                    fontSize: 13,
                    color: '#fff',
                    textShadow: '0 0 2px #000'
                  }}>{colorObj.pattern}</span>
                )}
              </span>
            );
          })}
          {guess.feedback && (
            <span style={{ marginLeft: 12, fontSize: 13, color: '#444' }}>
              ({guess.feedback.correct} correct, {guess.feedback.wrongPosition} misplaced)
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default PreviousGuesses;
