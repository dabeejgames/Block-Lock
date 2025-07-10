import React from 'react';

// Helper to get color object by name
const getColorObj = (colors, name) => colors.find(c => c.name === name);

function GuessPanel({
  currentGuess,
  onGuessChange,
  onSubmitGuess,
  colors,
  codeLength,
  colorBlindMode = false,
  easyMode = false,
  guesses = []
}) {
  // Fill next empty guess square with selected color
  const handleColorClick = (colorName) => {
    if (easyMode && currentGuess.includes(colorName)) return;
    const nextGuess = [...currentGuess];
    const emptyIdx = nextGuess.findIndex(c => !c);
    if (emptyIdx !== -1) {
      nextGuess[emptyIdx] = colorName;
      onGuessChange(nextGuess);
    }
  };

  // Remove color from a guess square
  const handleGuessSquareClick = (idx) => {
    const nextGuess = [...currentGuess];
    nextGuess[idx] = '';
    onGuessChange(nextGuess);
  };

  // Submit guess if all filled
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentGuess.some(c => !c)) {
      onSubmitGuess(currentGuess);
    }
  };

  return (
    <form className="guess-panel guess-form" onSubmit={handleSubmit} autoComplete="off">
      {/* Previous Guesses */}
      {guesses.length > 0 && (
        <div className="previous-guesses" style={{ marginBottom: 18 }}>
          {guesses.map((guess, i) => (
            <div key={i} className="guess-row" style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              {guess.code.map((color, idx) => {
                const colorObj = getColorObj(colors, color);
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
      )}

      {/* Current Guess Row */}
      <div className="guess-preview" style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
        {Array.from({ length: codeLength }).map((_, idx) => {
          const colorObj = getColorObj(colors, currentGuess[idx]);
          return (
            <div
              key={idx}
              className={colorObj ? 'color-preview-square' : 'color-preview-empty'}
              style={{
                background: colorObj ? colorObj.hex : '#eee',
                border: colorObj ? '2.5px solid #444' : '2.5px dashed #bbb',
                borderRadius: 6,
                width: 36,
                height: 36,
                margin: '0 5px',
                position: 'relative',
                cursor: colorObj ? 'pointer' : 'default',
                display: 'inline-block'
              }}
              tabIndex={0}
              aria-label={colorObj ? (colorBlindMode ? colorObj.pattern : colorObj.name) : 'Empty'}
              onClick={() => colorObj && handleGuessSquareClick(idx)}
            >
              {colorBlindMode && colorObj && (
                <span style={{
                  position: 'absolute',
                  top: 7,
                  left: 11,
                  fontSize: 13,
                  color: '#fff',
                  textShadow: '0 0 2px #000'
                }}>{colorObj.pattern}</span>
              )}
              {!colorObj && (
                <span style={{
                  color: '#bbb',
                  fontSize: 20,
                  lineHeight: '36px'
                }}>?</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Color Palette */}
      <div className="color-palette" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        {colors.map(color => (
          <button
            key={color.name}
            type="button"
            className="color-peg"
            style={{
              background: color.hex,
              border: '2px solid #333',
              width: 32,
              height: 32,
              borderRadius: 6,
              margin: '0 4px',
              opacity: easyMode && currentGuess.includes(color.name) ? 0.4 : 1,
              cursor: easyMode && currentGuess.includes(color.name) ? 'not-allowed' : 'pointer',
              position: 'relative'
            }}
            aria-label={colorBlindMode ? color.pattern : color.name}
            disabled={easyMode && currentGuess.includes(color.name)}
            onClick={() => handleColorClick(color.name)}
          >
            {colorBlindMode && (
              <span style={{
                position: 'absolute',
                top: 7,
                left: 10,
                fontSize: 13,
                color: '#fff',
                textShadow: '0 0 2px #000'
              }}>{color.pattern}</span>
            )}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={currentGuess.some(c => !c)}
        aria-label="Submit guess"
        style={{ marginTop: 10 }}
      >
        Guess
      </button>
    </form>
  );
}

export default GuessPanel;
