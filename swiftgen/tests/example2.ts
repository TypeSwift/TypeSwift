// Arrays and Optional Parameters
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Alice", "Bob", "Charlie"];

function sum(...values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

function sayHello(name: string = "Guest"): void {
  console.log(`Hello, ${name}!`);
}
