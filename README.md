![Header](https://github.com/TypeSwift/TypeSwift/assets/158503966/c9a1ff0c-f05e-4a51-b05c-72eb13cafcbb)

<p>&nbsp;</p>

# TypeSwift
A lightweight and typesafe code generation library built for interfacing with your Node projects using Swift.

![Cover](https://github.com/TypeSwift/TypeSwift/assets/158503966/ad793b15-ae1d-461e-b4a6-600470474de5)

### `output.swift`

```swift
enum TypeSwift {
  case toggle
  case setLabel(_ text: String)
  case addNumbers(_ a: Double, _ b: Double)
  case selectDevice(_ device: Device)

  enum Device {
    case Phone, Pad, Mac
  }

  // ...
}
```

Which can then be used in your Swift project as such _(no additional setup required)_:

```swift
webView.ts(.toggle)

webView.ts(.setLabel("Hello, world!"))

webView.ts(.addNumbers(9, 5))

webView.ts(.selectDevice(.Phone))
```

<p>&nbsp;</p>

## Walkthrough Demo

Creating a native SwiftUI Toolbar item that replaces the functionality of a React NavBar (46 seconds).

https://github.com/TypeSwift/TypeSwift/assets/158503966/b0bf6afc-157b-4a05-9fdb-331a06d048f5

<p>&nbsp;</p>

## Overview

*Refer to the [TypeSwift Wiki](https://github.com/TypeSwift/TypeSwift/wiki) for full, in-depth documentation.*

There are two main components to this project: **SwiftGen** and **WKExtensions**.

### SwiftGen

A node package that incorporates [ts-morph](https://github.com/dsherret/ts-morph) to fulfill the following purpose:

1. Uses [ts-morph](https://github.com/dsherret/ts-morph) to extract variables, functions, data structures and types from your code
2. Maps each TS type to a Swift equivalent for compatible calling
3. Generates a Swift data structure for easy interfacing
4. Stores the compiled JavScript calling method for evaluation in a WebKit object

Identifier extraction techniques are detailed [here](https://github.com/TypeSwift/TypeSwift/wiki/Extraction-Techniques#extracting-variables).

### WKExtensions

This Swift package allows you to interface with the TypeScript code, from within your Swift code, using a familiar syntax style. The enum data structure allows for certain features, such as auto-completion, in your favorite Swift IDE.

### TSWebView

An optional custom WebKit object that will allow you to interface with your Node project directly. No setup required. Just plugin and play!

Currently in development. See [ObservableWebView](https://github.com/buzsh/ObservableWebView) for more details on the base foundation.

<p>&nbsp;</p>

## Getting Started

*Note: I'm very new to publishing with NPM! If you have any suggestions for how to improve this flow, please open an issue.*

1. Drag the `TypeSwift/` folder into your Xcode project:

   - Make sure "Copy items if needed" is checked
   - Select "Create groups"

2. Navigate to `SwiftGen/`
3. Run `npm install`
4. Modify the `config.json`:

```json
{
  "inputDir": "path/to/ts-files",
  "outputDir": "path/to/xcode-proj/TypeSwift",
  "outputFileName": "TypeSwift",
   "outputSuffix": ".swift",
}
```

- `inputDir`: Path to directory containing the TypeScript files. Will search recursively. Resolves both relative and absolute paths.
- `outputDir`: Absolute path to the `TypeSwift/` folder that you dragged into your Xcode project.

5. Build in the CLI:

```sh
swiftgen
```

You're ready to start interacting with TypeScript in your Swift code! If you add new TypeScript variables or functions, simply build again with `swiftgen` to generate an updated file.

<p>&nbsp;</p>

## Usage

Refer to [Generation Schema by Example](https://github.com/TypeSwift/TypeSwift/wiki/Generation-Schema-by-Example) for more details.

#### Basic Syntax

```swift
let toggle = TypeSwift.toggle
webView.ts(toggle)

// or
webView.ts(.toggle)
```

#### Promises / async await <sup>coming soon</sup>

```swift
webView.somePromise() { result, error
  print(result)
}

let result = await webView.anotherPromise()
```

<p>&nbsp;</p>

https://github.com/TypeSwift/TypeSwift/assets/158503966/655ce073-b6fe-42f6-b991-b67cf60f604d

<p>&nbsp;</p>

Still working on the docs. Check back soon!

<p>&nbsp;</p>
