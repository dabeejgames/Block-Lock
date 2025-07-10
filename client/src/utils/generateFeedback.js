export function generateFeedback(guess, target) {
  let correct = 0, wrongPosition = 0;
  const codeLength = guess.length;
  const targetUsed = Array(codeLength).fill(false);
  const guessUsed = Array(codeLength).fill(false);

  for (let i = 0; i < codeLength; i++) {
    if (guess[i] === target[i]) {
      correct++;
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }
  for (let i = 0; i < codeLength; i++) {
    if (!guessUsed[i]) {
      for (let j = 0; j < codeLength; j++) {
        if (!targetUsed[j] && guess[i] === target[j]) {
          wrongPosition++;
          targetUsed[j] = true;
          break;
        }
      }
    }
  }
  return { correct, wrongPosition };
}
