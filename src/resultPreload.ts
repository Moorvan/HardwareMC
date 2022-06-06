import {ipcRenderer} from "electron";

ipcRenderer.on('result', (event, msg) => {
    console.log(msg)
    document.getElementById('result').innerText = msg;
})