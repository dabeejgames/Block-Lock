import React, { useState } from "react";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import GuessPanel from "./components/GuessPanel";

// Mock data for testing
const mockGameState = {
  room: "TEST123",
  players: {
    "alice": {
      name: "Alice",
      arrangement: ["red", "blue", "green", "yellow"],
      guesses: [
        {
          arrangement: ["blue", "red", "green", "yellow"],
          feedback: "partial"
        },
        {
          arrangement: ["red", "green", "blue", "yellow"],
          feedback: "wrong"
        }
      ],
      score: 0
    },
    "bob": {
      name: "Bob",
      arrangement: ["yellow", "green", "blue", "red"],
      guesses: [],
      score: 0
    }
  },
  currentPhase: "guessing", // "arranging", "guessing", "results"
  roundNumber: 1,
  timeRemaining: 45,
  winner: null,
  arrangements: {
    "alice": ["red", "blue", "green", "yellow"],
    "bob": ["yellow", "green", "blue", "red"]
  }
};

function MockApp() {
  const [currentView, setCurrentView] = useState("lobby"); // "lobby", "game"
  const [gameState, setGameState] = useState(mockGameState);
  const [currentPlayer, setCurrentPlayer] = useState("alice");

  const handleJoinRoom = (roomName, playerName) => {
    console.log("Mock: Joining room", roomName, "as", playerName);
    setCurrentPlayer(playerName);
    setCurrentView("game");
  };

  const handleSubmitArrangement = (arrangement) => {
    console.log("Mock: Submitting arrangement", arrangement);
    // Update mock game state
    setGameState(prev => ({
      ...prev,
      arrangements: {
        ...prev.arrangements,
        [currentPlayer]: arrangement
      }
    }));
  };

  const handleSubmitGuess = (guess) => {
    console.log("Mock: Submitting guess", guess);
    // Add guess to player's history
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [currentPlayer]: {
          ...prev.players[currentPlayer],
          guesses: [
            ...prev.players[currentPlayer].guesses,
            {
              arrangement: guess,
              feedback: Math.random() > 0.7 ? "correct" : Math.random() > 0.5 ? "partial" : "wrong"
            }
          ]
        }
      }
    }));
  };

  const resetToLobby = () => {
    setCurrentView("lobby");
    setGameState(mockGameState);
  };

  const togglePhase = () => {
    setGameState(prev => ({
      ...prev,
      currentPhase: prev.currentPhase === "arranging" ? "guessing" : "arranging"
    }));
  };

  const switchPlayer = () => {
    setCurrentPlayer(prev => prev === "alice" ? "bob" : "alice");
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px 0"
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: "0 auto", 
        padding: "0 24px"
      }}>
        {/* Testing Controls */}
        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "2px solid #2196f3"
        }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#1976d2" }}>🧪 Testing Controls</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={resetToLobby} style={buttonStyle}>
              Show Lobby
            </button>
            <button onClick={() => setCurrentView("game")} style={buttonStyle}>
              Show Game
            </button>
            <button onClick={togglePhase} style={buttonStyle}>
              Toggle Phase: {gameState.currentPhase}
            </button>
            <button onClick={switchPlayer} style={buttonStyle}>
              Switch to: {currentPlayer === "alice" ? "bob" : "alice"}
            </button>
          </div>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
            Current Player: <strong>{currentPlayer}</strong> | 
            Phase: <strong>{gameState.currentPhase}</strong>
          </p>
        </div>

        {/* Header */}
        <header style={{ 
          textAlign: "center", 
          marginBottom: 32,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "36px",
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🔒 Block Lock (Test Mode)
          </h1>
          <p style={{ 
            margin: "8px 0 0 0", 
            color: "#666",
            fontSize: "16px"
          }}>
            Testing Frontend Components
          </p>
        </header>

        {/* Main Content */}
        <main style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "24px"
        }}>
          {currentView === "lobby" ? (
            <Lobby joinRoom={handleJoinRoom} />
          ) : (
            <>
              {/* Room Info */}
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px"
              }}>
                <div>
                  <strong>Room:</strong> {gameState.room} | <strong>Player:</strong> {currentPlayer}
                </div>
                <button onClick={resetToLobby} style={buttonStyle}>
                  Back to Lobby
                </button>
              </div>

              {/* Game Components */}
              <GameBoard
                player={currentPlayer}
                gameState={gameState}
                onArrange={handleSubmitArrangement}
              />
              
              <GuessPanel
                player={currentPlayer}
                gameState={gameState}
                onGuess={handleSubmitGuess}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "8px 12px",
  fontSize: "12px",
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "2px"
};

export default MockApp;