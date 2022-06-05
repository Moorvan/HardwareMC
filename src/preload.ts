// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import {clipboard, ipcRenderer, contextBridge} from "electron"

export type ContextBridgeApi = {
    sendMsg: () => string
    updateClipboard: () => void
}

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
    }

    replaceText("clipboard", clipboard.readText())

    const e = document.getElementById("update")
    e.onclick = () => {
        const i = document.getElementById("clipboard")
        i.innerText = clipboard.readText()
    }

});


const bridgeApi: ContextBridgeApi = {
    sendMsg: () => {
        console.log(ipcRenderer.sendSync('msg', 'ping'))
        return "hello"
    },
    updateClipboard: () => {
        const e = document.getElementById('clipboard')
        if (e) {
            e.innerText = clipboard.readText()
        }
    }
}


contextBridge.exposeInMainWorld("api", bridgeApi)
ipcRenderer.on("dog", (event, arg) => {
    console.log("Received: " + arg)
    document.getElementById('clipboard').innerText = arg
})
