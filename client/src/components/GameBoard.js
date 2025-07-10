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
  const [draggedIndex, setDraggedIndex] = useState(null);

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

  const handleDragStart = (e, index) => {
    if (!canArrange) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      handleSwap(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    onArrange(arrangement);
  };

  const getBlockStyle = (color, index) => ({
    width: 60,
    height: 60,
    background: color,
    border: draggedIndex === index ? "3px solid #fff" : "2px solid #444",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#fff",
    cursor: canArrange ? "grab" : "default",
    transition: "all 0.2s ease",
    opacity: draggedIndex === index ? 0.5 : 1,
    transform: draggedIndex === index ? "rotate(5deg)" : "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  });

  const currentPhase = gameState?.currentPhase || "arranging";
  const timeRemaining = gameState?.timeRemaining || 0;

  return (
    <div style={{ marginTop: 32, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Your Block Arrangement</h2>
        {currentPhase === "arranging" && (
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            color: timeRemaining < 10 ? "#ff4444" : "#333" 
          }}>
            Time: {timeRemaining}s
          </div>
        )}
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: 12, 
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
        borderRadius: 16,
        marginBottom: 16
      }}>
        {arrangement.map((color, idx) => (
          <div
            key={idx}
            style={getBlockStyle(color, idx)}
            title={`${color} block - ${canArrange ? 'drag to rearrange' : 'submitted'}`}
            draggable={canArrange}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
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
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: 8 }}>
            💡 Drag blocks to rearrange, or click to swap with next block
          </p>
          <button 
            onClick={handleSubmit}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
          >
            Submit Arrangement
          </button>
        </div>
      )}
      
      {!canArrange && (
        <div style={{ 
          padding: "16px", 
          backgroundColor: "#e8f5e8", 
          borderRadius: "8px",
          border: "2px solid #4CAF50",
          color: "#2e7d32",
          fontWeight: "bold"
        }}>
          ✅ Arrangement submitted! Waiting for other players...
        </div>
      )}

      {gameState?.players && (
        <div style={{ marginTop: 20, fontSize: "14px", color: "#666" }}>
          Players in room: {Object.keys(gameState.players).length}
        </div>
      )}
    </div>
  );
}

export default GameBoard;