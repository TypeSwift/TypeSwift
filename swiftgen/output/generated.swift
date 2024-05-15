enum TypeSwift {

  // Variables
  case anchorDelay
  case actionDelay
  case delay
  case message
  case isVisible
  case numbers
  case names
  case defaultDirection
  case startPoint
  case endPoint

  // Functions
  case toggle()
  case setLabel(_ text: String)
  case hideObject(_ hidden: Bool = false)
  case addNumbers(_ a: Double, _ b: Double)
  case selectDevice(_ device: Device)
  case greet(_ name: String)
  case multiply(_ a: Double, _ b: Double)
  case sum(_ values: [Double])
  case sayHello(_ name: String = "Guest")
  case move(_ direction: Direction)
  case calculateArea(_ width: Double, _ height: Double)
  case translate(_ point: Point, _ dx: Double, _ dy: Double)
  case printPoint(_ point: Point)
  case identity<T>(_ arg: T)
  case fetchData(_ url: String)
  case combine<T, U>(_ first: T, _ second: U)

  // Enums
  enum Device {
    case Phone
    case Pad
    case Mac
  }
  enum Direction {
    case North
    case South
    case East
    case West
  }

  // Type Aliases
  struct Point {
    var x: Double
    var y: Double
  }
}
