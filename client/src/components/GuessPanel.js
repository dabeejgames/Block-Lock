import React, { useState } from "react";

// Example: 4 blocks/colors to guess
const BLOCK_COUNT = 4;
const COLORS = ["red", "blue", "green", "yellow"];

function GuessPanel({ player, gameState, onGuess }) {
  const [guess, setGuess] = useState(Array(BLOCK_COUNT).fill("red"));

  // Only allow guessing if it's your turn and the game state allows it
  const canGuess =
    gameState &&
    gameState.phase === "guessing" &&
    gameState.currentGuesser === player;

  const handleColorChange = (idx, color) => {
    const newGuess = [...guess];
    newGuess[idx] = color;
    setGuess(newGuess);
  };

  const handleSubmit = () => {
    onGuess(guess);
  };

  if (!gameState) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Guess the Arrangement</h2>
      {!canGuess ? (
        <div>
          {gameState.currentGuesser === player
            ? "Waiting for other player’s arrangement..."
            : "Waiting for your turn to guess..."}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            {guess.map((color, idx) => (
              <select
                key={idx}
                value={color}
                onChange={(e) => handleColorChange(idx, e.target.value)}
                style={{ width: 60, height: 32 }}
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            ))}
          </div>
          <button onClick={handleSubmit} style={{ marginTop: 16 }}>
            Submit Guess
          </button>
        </>
      )}
    </div>
  );
}

export default GuessPanel;