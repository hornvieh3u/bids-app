const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('darkMode', {
    toggle: (theme) => ipcRenderer.invoke('dark-mode:toggle', theme),
})

contextBridge.exposeInMainWorld('bidData', {
    save: (data) => ipcRenderer.invoke('bid-data:save', data),
    update: (data) => ipcRenderer.invoke('bid-data:update', data),
})

ipcRenderer.on("init", (_, data) => {
    data.forEach(value => {
        document.getElementById("platforms").innerHTML += `<option value="${value.id}">${value.platform_name} - ${value.user_name}</option>`
    });
})