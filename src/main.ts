import {app, BrowserWindow, Menu, ipcMain} from "electron";
import * as path from "path";
import * as Electron from "electron";


function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    // mainWindow.loadURL("https://www.baidu.com")
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    const isMac = process.platform === 'darwin'
    const menuTemp: Electron.MenuItemConstructorOptions[] = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideOthers'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        }] : []) as Electron.MenuItemConstructorOptions[],
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    click: () => openFinder()
                },
                {
                    label: 'Test',
                    click: () => {
                        console.log("hello")
                        mainWindow.webContents.send('dog', 'hahaha')
                    }
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+CmdOrCtrl+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools()
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(menuTemp)
    Menu.setApplicationMenu(menu)

    ipcMain.on('msg', (event, arg) => {
        console.log("Received: " + arg)
        event.returnValue = "pong"
    })
}

function openFinder() {
    console.log("ddd")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
