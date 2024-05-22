# SwiftGen

Using SwiftGen with TypeSwift to generate typesafe Swift code.

## Getting Started

### Installation

To ensure the `node_modules` are installed, navigate to this directory and run:

```sh
cd SwiftGen
npm install
```

### Configuration

Modify the `config.json` file. Example configuration:

```json
{
  "inputDir": "path/to/ts-files/root/dir",
  "outputDir": "path/to/TypeSwift",
  "outputPrefix": "",
  "outputSuffix": ".swift",
  "outputFileName": "TypeSwift",
  "debug": false
}
```

- `inputDir`: Path to TypeScript files that will be converted to Swift. The search is recursive.
- `outputDir`: Path to export the generated Swift file. It will replace any existing files with the same name and path.

### Build

Now run:

```sh
swiftgen
```

Alternatively:

```sh
swiftgen --config ./config.json
```

### Updating SwiftGen

To update it to the latest version, run:

```sh
npm update swiftgen
```
