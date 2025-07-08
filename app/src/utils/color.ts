export function vectorToColor(vector: number[]): string {
  if (vector.length < 3) return '#999';
  const [x, y, z] = vector;
  const hue = ((x + 1) * 180) % 360;
  const sat = 60 + (Math.abs(y) % 0.4) * 100;
  const light = 50 + (Math.abs(z) % 0.2) * 100;
  return `hsl(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%)`;
}
