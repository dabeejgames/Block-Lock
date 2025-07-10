import React, { useState } from "react";

function Lobby({ joinRoom }) {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!roomName.trim() || !playerName.trim()) {
      alert("Please enter both room name and player name");
      return;
    }

    setIsJoining(true);
    joinRoom(roomName.trim(), playerName.trim());
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomName(code);
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "0 auto", 
      padding: 32,
      backgroundColor: "#f9f9f9",
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: "#333", fontSize: "24px" }}>
          🔒 Block Lock
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
          Arrange blocks and guess your opponent's pattern!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: "bold",
            color: "#333"
          }}>
            Player Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
            disabled={isJoining}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: "bold",
            color: "#333"
          }}>
            Room Code
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box"
              }}
              disabled={isJoining}
            />
            <button
              type="button"
              onClick={generateRoomCode}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
              disabled={isJoining}
            >
              Generate
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isJoining || !roomName.trim() || !playerName.trim()}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: isJoining ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isJoining ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease"
          }}
        >
          {isJoining ? "Joining..." : "Join Room"}
        </button>
      </form>

      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        backgroundColor: "#e3f2fd",
        borderRadius: 8,
        fontSize: "14px",
        color: "#1565c0"
      }}>
        <h4 style={{ margin: "0 0 8px 0" }}>How to Play:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Arrange your colored blocks in any order</li>
          <li>Try to guess your opponent's arrangement</li>
          <li>First to guess correctly wins!</li>
        </ul>
      </div>
    </div>
  );
}

export default Lobby;