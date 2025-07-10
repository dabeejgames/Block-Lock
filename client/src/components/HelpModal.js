import React from 'react';

function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" tabIndex={-1} aria-modal="true" role="dialog">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close help">×</button>
        <h2>How to Play</h2>
        <ul>
          <li>Choose the code length and difficulty, then start the game.</li>
          <li>Select a color for each position and submit your guess.</li>
          <li>Feedback shows how many colors are correct and in the right place, and how many are correct but misplaced.</li>
          <li>Use the hint button once per game to reveal a correct color in the correct position.</li>
          <li>Try to crack the code in as few attempts and as quickly as possible!</li>
        </ul>
        <h3>Accessibility</h3>
        <ul>
          <li>Enable color-blind mode for extra patterns on pegs.</li>
          <li>All controls are keyboard accessible.</li>
        </ul>
      </div>
    </div>
  );
}

export default HelpModal;
