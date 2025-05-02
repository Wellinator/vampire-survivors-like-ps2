export function randInt(low: number, high: number) {
  return low + Math.floor(Math.random() * (high - low + 1));
} // Random float from <low, high> interval
