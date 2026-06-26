export const cMajorScale = {
  C4: { name: "C4", value: 261.63 },
  D4: { name: "D4", value: 293.66 },
  E4: { name: "E4", value: 329.63 },
  F4: { name: "F4", value: 349.23 },
  G4: { name: "G4", value: 392.0 },
  A4: { name: "A4", value: 440.0 },
  B4: { name: "B4", value: 493.88 },
  C5: { name: "C5", value: 523.25 },
  D5: { name: "D5", value: 587.33 },
  E5: { name: "E5", value: 659.26 },
  F5: { name: "F5", value: 698.46 },
  G5: { name: "G5", value: 783.99 },
} as const;

export const cMajoroptions = Object.values(cMajorScale);

export type NoteName = keyof typeof cMajorScale;
