const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openFile: () => ipcRenderer.invoke('open-file'),
    saveFile: (content) => ipcRenderer.invoke('save-file', content),
    contentChanged: () => ipcRenderer.invoke('content-changed'),
    getTheme: () => ipcRenderer.invoke('get-theme'),
    setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
    onSetContent: (callback) => ipcRenderer.on('set-content', (e, content) => callback(content)),
    onSetTheme: (callback) => ipcRenderer.on('set-theme', (e, theme) => callback(theme))
});
