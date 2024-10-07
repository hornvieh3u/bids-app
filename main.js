const { app, BrowserWindow, Tray, Notification, Menu, ipcMain, nativeTheme, nativeImage, screen } = require('electron/main')
const path = require('node:path')
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('E:/James/bids.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected to the bids database.');
});

let win;
let willClose = false;

function createWindow() {
    let display = screen.getPrimaryDisplay();

    win = new BrowserWindow({
        width: 800,
        height: 600,
        x: display.workArea.width - 800,
        y: display.workArea.height - 600,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'img/bid.png')
    })

    win.loadFile('src/index.html')
    win.on('ready-to-show', initData)
    win.on('close', closeApp)
}

function createTray() {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'img/bid.png'))
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', type: 'normal', click: () => { willClose = true; app.quit() } },
    ])

    tray.setToolTip('Bid Application')
    tray.setContextMenu(contextMenu)
    tray.on("double-click", () => { win.show(); })
}

function closeApp(e) {
    if (willClose) {
        db.close();
        return;
    }

    e.preventDefault();
    win.hide();
}

function initData() {
    db.all("select * from chat_platforms", [], (_, rows) => {
        win.webContents.send('init', rows);
    })
}

function showNotification(body) {
    new Notification({ title: "Bid App", body }).show()
}

app.whenReady().then(() => {
    createWindow()
    createTray()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    // Your Code
});

ipcMain.handle('dark-mode:toggle', (_, theme) => {
    nativeTheme.themeSource = theme
})

ipcMain.handle("bid-data:update", (_, data) => {
    try {
        
        return true;
    } catch (error) {
        return false;
    }
})

ipcMain.handle("bid-data:save", (_, data) => {
    try {
        db.run(
            `INSERT INTO "main"."clients"
            (
                "client_username",
                "client_country",
                "client_timezone",
                "client_call_time",
                "client_job",
                "chat_platform_id",
                "chat_server",
                "is_responsed",
                "comment",
                "created_at"
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.client_username,
                data.client_country,
                data.client_timezone,
                data.client_call_time,
                data.client_job,
                data.chat_platform_id,
                data.chat_server,
                0,
                data.comment,
                Date.now()
            ]
        );
        return true;
    } catch (error) {
        return false;
    }
})