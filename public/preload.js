const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jobHandler", {
  handleCronJob: (args) => ipcRenderer.sendSync("handleCronJob", args),
  getJobs: () => ipcRenderer.sendSync("getJobs"),
  delJob: (id) => ipcRenderer.sendSync("delJob", id),
});

contextBridge.exposeInMainWorld("config", {
  color: () => ipcRenderer.sendSync("getAccentColor"),
});

contextBridge.exposeInMainWorld("actions", {
  closeButton: () => ipcRenderer.sendSync("closeButton"),
});

contextBridge.exposeInMainWorld("storageApi", {
  showDialog: () =>
    ipcRenderer.invoke("showDialog").then((result) => {
      return result;
    }),
  getDefaultPath: () => ipcRenderer.sendSync("getDefaultPath"),
  getCurrentPath: () => ipcRenderer.sendSync("getCurrentPath"),
  setPath: (path) => ipcRenderer.sendSync("setPath", path),
  importFile: (file) => ipcRenderer.sendSync("importFile", file),
  shareDialog: () => ipcRenderer.sendSync("shareDialog"),
});
