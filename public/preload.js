const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    color: () => ipcRenderer.sendSync("getAccentColor"),
    closeButton: () => ipcRenderer.sendSync("closeButton"),
    handleCronJob: args => ipcRenderer.sendSync("handleCronJob", args),
    getJobs: () => ipcRenderer.sendSync("getJobs"),
    delJob: id => ipcRenderer.sendSync("delJob", id),
});
