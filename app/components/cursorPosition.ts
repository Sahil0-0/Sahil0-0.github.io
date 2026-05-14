export type CursorPosition = { x: number; y: number };

let lastCursorPosition: CursorPosition | null = null;

export function getLastCursorPosition() {
  return lastCursorPosition;
}

export function setLastCursorPosition(position: CursorPosition) {
  lastCursorPosition = position;
}
