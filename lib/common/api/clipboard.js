'use strict'

const clipboard = process.atomBinding('clipboard')

if (process.type === 'renderer') {
  const ipcRendererUtils = require('@electron/internal/renderer/ipc-renderer-internal-utils')
  const makeMethod = function (method) {
    return (...args) => ipcRendererUtils.invokeSync('ELECTRON_BROWSER_CLIPBOARD', method, ...args)
  }

  if (process.platform === 'linux') {
    // On Linux we could not access clipboard in renderer process.
    for (const method of Object.keys(clipboard)) {
      clipboard[method] = makeMethod(method)
    }
  } else if (process.platform === 'darwin') {
    // Read/write to find pasteboard over IPC since only main process is notified of changes
    clipboard.readFindText = makeMethod('readFindText')
    clipboard.writeFindText = makeMethod('writeFindText')
  }
}

module.exports = clipboard
