//
//  AppDelegate.swift
//  MacDemo
//
//  Created by Justin Bush on 4/13/22.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
  
  var mainWindow: NSWindow!
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    mainWindow = NSApplication.shared.windows[0]
    NSApp.activate(ignoringOtherApps: true)
  }
  
  func applicationWillTerminate(_ aNotification: Notification) {
    // Insert code here to tear down your application
  }
  
  func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
    return true
  }
  
  // Handles Reopening of Main Window
  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    if !flag { for window in sender.windows { window.makeKeyAndOrderFront(self) }}
    return true
  }
  
}

