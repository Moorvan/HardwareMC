import {app, BrowserWindow, Menu, ipcMain, dialog} from "electron";
import * as path from "path";
import * as Electron from "electron";
import * as isDev from "electron-is-dev";


function createMainWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "mainPreload.js"),
        },
        width: 800
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../html/index.html"));
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    const isMac = process.platform === 'darwin'
    const menuTemp: Electron.MenuItemConstructorOptions[] = [
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
                    click: () => {
                        const result = openFinder()
                        if (result) {
                            console.log(result)
                            mainWindow.webContents.send('open-file', result)
                        }
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
    mainWindow.webContents.send('is-dev', isDev)

    ipcMain.on('msg', (event, arg) => {
        console.log("Received: " + arg)
        event.returnValue = "pong"
    })
}

function createResultWindow(result: string) {
    const resultWindow = new BrowserWindow({
        height: 400,
        width: 300,
        webPreferences: {
            preload: path.join(__dirname, "resultPreload.js"),
        }
    })
    resultWindow.loadFile(path.join(__dirname, "../html/result.html"))
    resultWindow.webContents.send('result', result)
}

function openFinder() {
    const files = dialog.showOpenDialogSync({
        title: 'Select a btor2 file',
        properties: ['openFile'],
        filters: [
            {name: 'btor2', extensions: ['btor2', 'btor']},
            {name: 'SystemVerilog', extensions: ['sv']}
        ]
    })
    if (files && files.length > 0) {
        console.log(files[0])
        const file = files[0]
        if (file.endsWith('.btor2') || file.endsWith('.btor')) {
            return {filePath: file, fileType: 'btor2'}
        } else if (file.endsWith('sv')) {
            return {filePath: file, fileType: 'sv'}
        }
    }
}

ipcMain.on('show-result', (event, arg) => {
    createResultWindow(arg)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createMainWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
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
