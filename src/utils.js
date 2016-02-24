export function getRandomNumber(max) {
	return Math.round(Math.random() * max);
}
export function getHigh4Bits(n) {
  return n >> 4;
}
export function getLow4Bits(n) {
  return n & 0x0F;
}
export function combineHighLow(high, low) {
  return (high << 4) | low;
}
