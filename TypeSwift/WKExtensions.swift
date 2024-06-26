//
//  TypeSwift
//  Created by Justin Bush (@buzsh)
//  https://typeswift.org
//  https://github.com/TypeSwift/TypeSwift.git
//
//  Generated by SwiftGen v0.1.0
//  DO NOT MODIFY THE CONTENTS OF THIS FILE
//

import WebKit

extension WKWebView {
  ///
  /// Executes the JavaScript code corresponding to a `TypeSwift` enumeration case.
  ///
  /// This method evaluates the JavaScript code generated by the `jsString` property of the `TypeSwift` enumeration.
  ///
  /// - Parameter identifier: The `TypeSwift` enumeration case to be evaluated.
  ///
  /// # Usage:
  /// ```
  /// webView.ts(.variable)
  /// webView.ts(.function(param))
  /// ```
  func ts(_ identifier: TypeSwift) {
    self.evaluateJavaScript(identifier.jsString, completionHandler: nil)
  }
}
