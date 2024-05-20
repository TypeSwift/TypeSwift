# TypeSwift
A lightweight and typesafe multi-language library built for interfacing with your Node projects using native Swift.

![Cover](https://github.com/TypeSwift/TypeSwift/assets/158503966/ad793b15-ae1d-461e-b4a6-600470474de5)

### `output.swift`

```swift
enum TypeSwift {
  // ...
  case toggle()
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
webView.ts(.toggle())

webView.ts(.setLabel("Hello, world!"))

webView.ts(.addNumbers(9, 5))

webView.ts(.selectDevice(.Phone))
```

<p>&nbsp;</p>

## Walkthrough Demo

Creating a native SwiftUI Toolbar item that replaces the functionality of the React NavBar (58 seconds).

https://github.com/TypeSwift/TypeSwift/assets/158503966/4a8655f8-76fd-441e-8de0-9d8e69277c17

<p>&nbsp;</p>

## Getting Started

There are two main components to this project: **SwiftGen** and **WK+TypeSwift**.

### SwiftGen

A node package that incorporates [ts-morph](https://github.com/dsherret/ts-morph) to fulfill the following purpose:

1. Uses [ts-morph](https://github.com/dsherret/ts-morph) to extract variables, functions, data structures and types from your code
2. Maps these each type to a Swift equivalent for easy calling
3. Generates a Swift data structure that allows you to interface with the typesafe code in Swift

### WK+TypeSwift

This Swift package allows you to interface with the TypeScript code, from within your Swift code, using a familiar syntax style. The enum data structure allows for certain features, such as auto-completion, in your favorite Swift IDE.

### TSWebView

An optional custom WebKit object that will allow you to interface with your Node project directly. No setup required. Just plugin and play!

## Usage

#### Basic Syntax

```swift
let toggle = TypeSwift.toggle()
webView.ts(toggle)

// or
webView.ts(.toggle())
```

#### Promises / async await

```swift
webView.somePromise() { result, error
  print(result)
}

let result = await webView.anotherPromise()
```

<p>&nbsp;</p>

## SwiftGen

https://github.com/TypeSwift/TypeSwift/assets/158503966/655ce073-b6fe-42f6-b991-b67cf60f604d

<p>&nbsp;</p>

Still working on the docs. Check back soon!

<p>&nbsp;</p>
