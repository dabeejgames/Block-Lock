export function playSound(type) {
  try {
    if (type === 'win') {
      new Audio('/sounds/win.mp3').play();
    } else if (type === 'guess') {
      new Audio('/sounds/guess.mp3').play();
    }
  } catch {}
}
