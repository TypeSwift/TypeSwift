// Objects and Type Aliases
type Point = {
  x: number;
  y: number;
};

const startPoint: Point = { x: 0, y: 0 };
const endPoint: Point = { x: 10, y: 20 };

function translate(point: Point, dx: number, dy: number): Point {
  return { x: point.x + dx, y: point.y + dy };
}

function printPoint(point: Point): void {
  console.log(`Point(${point.x}, ${point.y})`);
}
