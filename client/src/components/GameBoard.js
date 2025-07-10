import React, { useState } from "react";

// Example: 4 blocks to arrange
const BLOCK_COUNT = 4;

// Helper: create an array of n shuffled colors
function getDefaultBlocks() {
  const colors = ["red", "blue", "green", "yellow"];
  return colors.slice(0, BLOCK_COUNT);
}

function GameBoard({ player, gameState, onArrange }) {
  const [arrangement, setArrangement] = useState(getDefaultBlocks());

  // Allow the player to arrange blocks if arrangement not yet submitted
  const canArrange =
    !gameState ||
    !gameState.arrangements ||
    !gameState.arrangements[player];

  const handleSwap = (i, j) => {
    const newArr = [...arrangement];
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    setArrangement(newArr);
  };

  const handleSubmit = () => {
    onArrange(arrangement);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Your Block Arrangement</h2>
      <div style={{ display: "flex", gap: 8 }}>
        {arrangement.map((color, idx) => (
          <div
            key={idx}
            style={{
              width: 40,
              height: 40,
              background: color,
              border: "2px solid #444",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#fff",
              cursor: canArrange ? "pointer" : "default",
            }}
            title={color}
            onClick={() =>
              canArrange && idx < arrangement.length - 1
                ? handleSwap(idx, idx + 1)
                : undefined
            }
          >
            {color.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      {canArrange && (
        <button onClick={handleSubmit} style={{ marginTop: 16 }}>
          Submit Arrangement
        </button>
      )}
      {!canArrange && <div style={{ marginTop: 8 }}>Arrangement submitted!</div>}
    </div>
  );
}

export default GameBoard;