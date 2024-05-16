# TypeSwift
A lightweight and typesafe framework built for interfacing with your Node projects using native Swift.

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

webView.toggle()

webView.setLabel("Hello, world!")

webView.addNumbers(9, 5)

webView.selectDevice(.Phone)
```

<hr />

https://github.com/TypeSwift/TypeSwift/assets/158503966/655ce073-b6fe-42f6-b991-b67cf60f604d

## Getting Started

There are two main components to this project: **SwiftGen** and **TSExtensions**.

### SwiftGen

A node package that incorporates [ts-morph](https://github.com/dsherret/ts-morph) to fulfill the following purpose:

1. Uses [ts-morph](https://github.com/dsherret/ts-morph) to extract variables, functions, data structures and types from your code
2. Maps these each type to a Swift equivalent for easy calling
3. Generates a Swift data structure that allows you to interface with the typesafe code in Swift

### TSExtensions

This Swift package allows you to interface with the TypeScript code, from within your Swift code, using a familiar syntax style. The enum data structure allows for certain features, such as auto-completion, in your favorite Swift IDE.

### TSWebView

An optional custom WebKit object that will allow you to interface with your Node project directly. No setup required. Just plugin and play!

## Usage

### Promises / async await

```swift
webView.somePromise() { result, error
  print(result)
}

let result = await webView.anotherPromise()
```
