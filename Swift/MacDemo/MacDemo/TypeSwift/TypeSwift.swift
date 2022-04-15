//
//  TypeSwift.swift
//  MacDemo
//
//  Created by Justin Bush on 4/15/22.
//

import Foundation

enum TypeSwift {
  
  // Variables
  case anchorDelay
  case actionDelay
  
  //Functions
  case toggle(Void = ())
  case setLabel(_ text: String)
  case hideObject(_ hidden: Bool = false)
  case addNumbers(_ a: Double, _ b: Double)
  case selectDevice(_ device: Device)
  
  
  enum Device: String {
    case phone = "iOS"
    case pad = "iPadOS"
    case mac = "macOS"
    
    var js: String {
      switch self {
      case .phone: return "Device.Phone"
      case .pad: return "Device.Pad"
      case .mac: return "Device.Mac"
      }
    }
  }
}
