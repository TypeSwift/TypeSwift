// Enums and Complex Types
enum Direction {
  North = "N",
  South = "S",
  East = "E",
  West = "W"
}

const defaultDirection: Direction = Direction.North;

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

function calculateArea(width: number, height: number): number {
  return width * height;
}
