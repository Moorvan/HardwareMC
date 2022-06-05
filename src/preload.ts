// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import {ipcRenderer, contextBridge} from "electron"
import {exec} from "child_process"
import * as stream from "stream";

export const binPath = "./deps/oss-cad-suite/bin/"
export type ContextBridgeApi = {
    sendMsg: () => string
    filePath?: string
    fileType?: string
    canCheck?: boolean
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded")
    const e = document.getElementById("pono -h")
    e.onclick = () => {
        exec(binPath + "pono -h", (err, stdout, stderr) => {
            console.log(stdout)
        })
    }
    Array.from(
        document.getElementsByClassName('check') as HTMLCollectionOf<HTMLElement>
    ).forEach(e => {
        e.style.display = 'none'
    })

    const submit = document.getElementById('submit')
    submit.onclick = () => {
        console.log("submit")
        const algorithm = document.getElementById('algorithm') as HTMLInputElement
        const step = document.getElementById('step') as HTMLInputElement
        if (algorithm.value == '' || step.value == '') {
            alert('Please input algorithm and step')
            return
        }
        solve(algorithm.value, Number(step.value))
    }
});

function solve(algorithm: string, step: number) {
    if ((algorithm == 'ind' || algorithm == 'bmc') && step > 1 && step < 50) {
        exec(binPath + 'pono -e ' + algorithm + ' -k ' + step + ' -v 1 ' + bridgeApi.filePath, (error, stdout, stderr) => {
            console.log(stdout)
        })
    }
}


const bridgeApi: ContextBridgeApi = {
    sendMsg: () => {
        console.log(ipcRenderer.sendSync('msg', 'ping'))
        return "hello"
    }
}
contextBridge.exposeInMainWorld("api", bridgeApi)

ipcRenderer.on('open-file', (event, msg, msg1) => {
    bridgeApi.filePath = msg.filePath
    bridgeApi.fileType = msg.fileType
    bridgeApi.canCheck = true

    const filePath = document.getElementById('file-path')
    if (filePath) {
        filePath.innerText = msg.filePath
    }
    const fileType = document.getElementById('file-type')
    if (fileType) {
        fileType.innerText = msg.fileType
    }

    Array.from(
        document.getElementsByClassName('check') as HTMLCollectionOf<HTMLElement>
    ).forEach(e => {
        e.style.display = 'block'
    })
})
