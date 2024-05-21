# SwiftGen

For full documentation, refer to the [TypeSwift project on GitHub](https://github.com/TypeSwift/TypeSwift).

## Getting Started

1. Locate `config.json` in `src/config`. Make adjustments.

```json
{
  "inputDir": "path/to/ts-files",
  "outputDir": "export/swift-file/to/path",
  "outputPrefix": "",
  "outputSuffix": ".swift",
  "outputFileName": "TypeSwift"
}
```

- `inputDir`: Path to TypeScript files that will be converted to Swift. Will search recursively. Resolves both relative and absolute paths.
- `outputDir`: Where to export the generated Swift file to. Will replace any existing files with the same output name and path. Resolves both relative and absolute paths.

2. Build

```npm
npm run build
npm start
```

3. Start using TypeScript in your Swift code! 

See the test files for example input and generated output. For additional documentation, refer to the [TypeSwift project on GitHub](https://github.com/TypeSwift/TypeSwift).
