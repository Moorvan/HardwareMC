// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import {clipboard, ipcRenderer, contextBridge} from "electron"

export type ContextBridgeApi = {
    sendMsg: () => string
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

});


const sendMsgApi: ContextBridgeApi = {
    sendMsg: () => {
        console.log("sendMsg")
        ipcRenderer.sendSync("msg")
        return "hello"
    }
}

contextBridge.exposeInMainWorld("api", sendMsgApi)
ipcRenderer.on("dog", (event, arg) => {
    console.log("Received: " + arg)
    document.getElementById('clipboard').innerText = arg
})
