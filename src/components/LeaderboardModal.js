import React from 'react';

function LeaderboardModal({ leaderboard, onClose }) {
  return (
    <div className="modal-overlay" tabIndex={-1} aria-modal="true" role="dialog">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close leaderboard">×</button>
        <h2>Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p>No scores yet. Play a game!</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Attempts</th>
                <th>Time</th>
                <th>Code Len.</th>
                <th>Difficulty</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.name}</td>
                  <td>{entry.attempts}</td>
                  <td>{entry.time}s</td>
                  <td>{entry.codeLength}</td>
                  <td>{entry.difficulty}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeaderboardModal;
