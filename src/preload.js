const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('darkMode', {
    toggle: (theme) => ipcRenderer.invoke('dark-mode:toggle', theme),
})

contextBridge.exposeInMainWorld('bidData', {
    getOne: (id) => ipcRenderer.invoke('bid-data:getone', id),
    save: (data) => ipcRenderer.invoke('bid-data:save', data),
    update: (data) => ipcRenderer.invoke('bid-data:update', data),
})

ipcRenderer.on("init", (_, platforms) => {
    platforms.forEach(platform => {
        document.getElementById("platforms").innerHTML += `<option value="${platform.id}">${platform.user_name} - ${platform.platform_name}</option>`
    });
})

ipcRenderer.on("bids", (_, bids) => {
    let tbody = "";
    bids.forEach(bid => {
        for (let i = 0; i < 100; i++) {
        tbody += `<tr>
            <td>${bid.client_username}</td>
            <td>${bid.chat_server}</td>
            <td>${bid.user_name} - ${bid.platform_name}</td>
            <td>
                <button
                    onclick="showModal(
                        ${bid.id},
                        '${bid.client_username}',
                        '${bid.client_country}',
                        '${bid.client_timezone}',
                        '${bid.client_call_time}',
                        '${bid.client_job}',
                        '${bid.comment}'
                    );"
                >Edit</button>
            </td>
        </tr>`;
        }
    });

    if (tbody) document.querySelector("tbody").innerHTML = tbody;
})