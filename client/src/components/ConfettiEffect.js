import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

function ConfettiEffect() {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);
  return null;
}

export default ConfettiEffect;
