const anchorDelay = 1000;
const actionDelay = 2000;

function toggle(): void {
  // some toggle func
}

function setLabel(text: string): void {
  // text setter eg
}

function hideObject(hidden: boolean = false): void {
  // toggle with pass val
}

function addNumbers(a: number, b: number): number {
  return a + b; // math op
}

function selectDevice(device: Device): void {
  // select enum type
}

enum Device {
  Phone = "iOS",
  Pad = "iPadOS",
  Mac = "macOS"
}
