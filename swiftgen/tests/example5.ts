// Generic Types and Promises
function identity<T>(arg: T): T {
  return arg;
}

function fetchData(url: string): Promise<string> {
  return fetch(url).then(response => response.text());
}

function combine<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}
