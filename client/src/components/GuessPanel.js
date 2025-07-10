import React, { useState } from "react";

const AVAILABLE_COLORS = ["red", "blue", "green", "yellow"];

function GuessPanel({ player, gameState, onGuess }) {
  const [currentGuess, setCurrentGuess] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canGuess = 
    gameState?.currentPhase === "guessing" &&
    gameState?.arrangements &&
    gameState?.arrangements[player]; // Player must have submitted arrangement

  const playerGuesses = gameState?.players?.[player]?.guesses || [];
  const opponentName = gameState?.players ? 
    Object.keys(gameState.players).find(p => p !== player) : 
    "Opponent";

  const handleColorSelect = (position, color) => {
    const newGuess = [...currentGuess];
    newGuess[position] = color;
    setCurrentGuess(newGuess);
  };

  const handleSubmitGuess = async () => {
    if (currentGuess.some(color => !color)) {
      alert("Please select a color for each position");
      return;
    }

    setIsSubmitting(true);
    await onGuess(currentGuess);
    setCurrentGuess(["", "", "", ""]);
    setIsSubmitting(false);
  };

  const getColorStyle = (color, isSelected = false) => ({
    width: 30,
    height: 30,
    backgroundColor: color,
    border: isSelected ? "3px solid #333" : "2px solid #666",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    transform: isSelected ? "scale(1.1)" : "scale(1)",
    boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.2)"
  });

  const getGuessBlockStyle = (color, position) => ({
    width: 40,
    height: 40,
    backgroundColor: color || "#f0f0f0",
    border: "2px solid #999",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "12px",
    color: color ? "#fff" : "#999",
    cursor: "pointer",
    transition: "all 0.2s ease"
  });

  const getFeedbackStyle = (feedback) => {
    const colors = {
      correct: "#4CAF50",
      partial: "#FF9800", 
      wrong: "#f44336"
    };
    return {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: colors[feedback] || "#999"
    };
  };

  if (!canGuess) {
    return (
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <h3>Guess Panel</h3>
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
          color: "#856404"
        }}>
          {gameState?.currentPhase === "arranging" 
            ? "⏳ Waiting for all players to submit their arrangements..."
            : "🎯 Submit your arrangement first to start guessing!"
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        🎯 Guess {opponentName}'s Arrangement
      </h3>

      {/* Current Guess Builder */}
      <div style={{ 
        backgroundColor: "#f8f9fa",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20
      }}>
        <h4 style={{ margin: "0 0 16px 0", textAlign: "center" }}>
          Your Current Guess:
        </h4>
        
        <div style={{ 
          display: "flex", 
          gap: 12, 
          justifyContent: "center",
          marginBottom: 20
        }}>
          {currentGuess.map((color, idx) => (
            <div
              key={idx}
              style={getGuessBlockStyle(color, idx)}
              onClick={() => {
                // Cycle through colors when clicking
                const currentIndex = AVAILABLE_COLORS.indexOf(color);
                const nextIndex = (currentIndex + 1) % AVAILABLE_COLORS.length;
                handleColorSelect(idx, AVAILABLE_COLORS[nextIndex]);
              }}
              title={`Position ${idx + 1}: ${color || 'Click to select'}`}
            >
              {color ? color.charAt(0).toUpperCase() : "?"}
            </div>
          ))}
        </div>

        {/* Color Palette */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: 8 }}>
            Click a position above, then select a color:
          </p>
          <div style={{ 
            display: "flex", 
            gap: 8, 
            justifyContent: "center"
          }}>
            {AVAILABLE_COLORS.map(color => (
              <div
                key={color}
                style={getColorStyle(color)}
                onClick={() => {
                  // Find first empty position and fill it
                  const emptyIndex = currentGuess.findIndex(c => !c);
                  if (emptyIndex !== -1) {
                    handleColorSelect(emptyIndex, color);
                  }
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmitGuess}
            disabled={isSubmitting || currentGuess.some(c => !c)}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: (isSubmitting || currentGuess.some(c => !c)) ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (isSubmitting || currentGuess.some(c => !c)) ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Guess"}
          </button>
        </div>
      </div>

      {/* Previous Guesses */}
      {playerGuesses.length > 0 && (
        <div style={{ 
          backgroundColor: "#ffffff",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #e0e0e0"
        }}>
          <h4 style={{ margin: "0 0 16px 0" }}>Previous Guesses:</h4>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {playerGuesses.map((guess, idx) => (
              <div key={idx} style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                marginBottom: 12,
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                borderRadius: 8
              }}>
                <span style={{ fontWeight: "bold", minWidth: 60 }}>
                  #{idx + 1}:
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {guess.arrangement.map((color, colorIdx) => (
                    <div
                      key={colorIdx}
                      style={{
                        ...getGuessBlockStyle(color),
                        width: 24,
                        height: 24,
                        fontSize: "10px"
                      }}
                    >
                      {color.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div style={getFeedbackStyle(guess.feedback)}>
                  {guess.feedback === "correct" ? "✅ Correct!" : 
                   guess.feedback === "partial" ? "🟡 Partial" : 
                   "❌ Wrong"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Status */}
      {gameState?.timeRemaining && (
        <div style={{ 
          textAlign: "center", 
          marginTop: 16,
          fontSize: "16px",
          fontWeight: "bold",
          color: gameState.timeRemaining < 10 ? "#ff4444" : "#333"
        }}>
          Time remaining: {gameState.timeRemaining}s
        </div>
      )}
    </div>
  );
}

export default GuessPanel;