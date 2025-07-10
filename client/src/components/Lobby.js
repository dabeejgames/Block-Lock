import React, { useState } from "react";

// Simple Lobby component for joining/creating a room
function Lobby({ joinRoom }) {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName && playerName) {
      joinRoom(roomName, playerName);
    }
  };

  return (
    <div>
      <h2>Join or Create a Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Room Name:{" "}
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Your Name:{" "}
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: 12 }}>
          Enter Room
        </button>
      </form>
    </div>
  );
}

export default Lobby;