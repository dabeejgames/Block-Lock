import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import GuessPanel from "./components/GuessPanel";

const socket = io("ws://localhost:4000"); // Connect to backend

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState("");
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Listen for game state updates from server
    socket.on("gameState", (state) => {
      setGameState(state);
    });

    // Optionally: Listen for join confirmation
    socket.on("joinedRoom", ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setInRoom(true);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("gameState");
      socket.off("joinedRoom");
    };
  }, []);

  const joinRoom = (roomName, playerName) => {
    socket.emit("joinRoom", { room: roomName, player: playerName });
  };

  const submitArrangement = (arrangement) => {
    socket.emit("submitArrangement", { room, player, arrangement });
  };

  const submitGuess = (guess) => {
    socket.emit("submitGuess", { room, player, guess });
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Block Lock</h1>
      {!inRoom ? (
        <Lobby joinRoom={joinRoom} />
      ) : (
        <>
          <GameBoard
            player={player}
            gameState={gameState}
            onArrange={submitArrangement}
          />
          <GuessPanel
            player={player}
            gameState={gameState}
            onGuess={submitGuess}
          />
        </>
      )}
    </div>
  );
}

export default App;