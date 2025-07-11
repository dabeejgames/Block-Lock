export function generateCode({ codeLength, colors, difficulty }) {
  if (difficulty === 'easy') {
    const shuffled = [...colors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, codeLength);
  } else {
    return Array.from({ length: codeLength }, () =>
      colors[Math.floor(Math.random() * colors.length)]
    );
  }
}
