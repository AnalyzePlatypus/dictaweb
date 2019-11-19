export function nextNumberWithWrapping(currentNumber, max) {
  if(currentNumber >= max) return 0;
  return currentNumber + 1;
}

export function previousNumberWithWrapping(currentNumber, max) {
  if(currentNumber <= 0) return max;
  return currentNumber - 1;
}