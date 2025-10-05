
export const calculateESI = (radius: number, insolation: number): number => {
  const esiRadius = Math.pow(1 - Math.abs((radius - 1) / (radius + 1)), 0.57);
  const esiInsolation = Math.pow(1 - Math.abs((insolation - 1) / (insolation + 1)), 1.07);
  return esiRadius * esiInsolation;
};

export const getEsiColor = (esi: number): string => {
  const hue = esi * 120; // ESI 0 (red) -> 1 (green)
  return `hsl(${hue}, 90%, 65%)`;
};