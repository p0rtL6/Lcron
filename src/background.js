"use strict";

const isDevelopment = process.env.NODE_ENV !== "production";

import {
  app,
  protocol,
  BrowserWindow,
  screen,
  systemPreferences,
  ipcMain,
  Tray,
  Menu,
  dialog,
} from "electron";

import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const storage = require("electron-json-storage");
const cron = require("node-cron");
const path = require("path");
const open = require("open");
const fs = require("fs");

let jobs;
let data;
let config;

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createTray(window) {
  // eslint-disable-next-line no-undef
  let appIcon = new Tray(path.join(__static, "Lcron.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function () {
        window.show();
      },
    },
    {
      label: "Exit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  appIcon.on("click", function () {
    window.show();
  });

  appIcon.setToolTip("Lcron");
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}

async function createWindow() {
  const display = screen.getPrimaryDisplay();
  const width = display.workAreaSize.width;
  const height = display.workAreaSize.height;
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 410,
    y: height - 610,
    frame: false,
    resizable: false,
    transparent: true,
    title: "Lcron",
    // eslint-disable-next-line no-undef
    icon: path.join(__static, "Lcron.ico"),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      // eslint-disable-next-line no-undef
      preload: path.join(__static, "preload.js"),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  let tray = null;
  win.on("minimize", function () {
    win.setSkipTaskbar(true);
    tray = createTray(win);
  });

  win.on("restore", function () {
    win.show();
    win.setSkipTaskbar(false);
    tray.destroy();
  });

  ipcMain.on("closeButton", (event) => {
    win.minimize();
    event.returnValue = true;
  });

  let isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("getAccentColor", (event) => {
  event.returnValue = systemPreferences.getAccentColor();
});

// Cron Handler

function loadData() {
  storage.setDataPath();
  config = storage.getSync("Config");
  storage.setDataPath(config.dataPath);
  for (const job in jobs) {
    jobs[job].stop();
  }
  jobs = {};
  data = storage.getSync("Jobs");
  for (const id in data) {
    addJob(id, data[id]);
  }
}

function writeData() {
  storage.set("Jobs", data, (error) => {
    if (error) throw error;
  });
}

function addJob(id, args) {
  jobs[id] = cron.schedule(`${args.mins} ${args.hrs} * * ${args.days}`, () => {
    open(args.link);
  });
  jobs[id].start();
}

ipcMain.on("handleCronJob", (event, args) => {
  const hrs = args.time.substr(0, 2);
  const mins = args.time.substr(3, 5);
  const days = args.weekday.map((weekday) => weekday.substr(0, 3)).join();
  data[args.id] = {
    title: args.title,
    link: args.link,
    days: days,
    hrs: hrs,
    mins: mins,
  };
  addJob(args.id, data[args.id]);
  writeData();
  event.returnValue = true;
});

ipcMain.on("getJobs", (event) => {
  event.returnValue = data;
});

ipcMain.on("delJob", (event, id) => {
  jobs[id].stop();
  delete data[id];
  writeData();
  event.returnValue = true;
});

ipcMain.handle("showDialog", async () => {
  const pathName = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return pathName.canceled ? null : pathName.filePaths[0];
});

ipcMain.on("getDefaultPath", (event) => {
  event.returnValue = storage.getDefaultDataPath();
});

ipcMain.on("getCurrentPath", (event) => {
  event.returnValue = storage.getDataPath();
});

ipcMain.on("setPath", (event, path) => {
  storage.setDataPath();
  storage.set("Config", { dataPath: path }, (error) => {
    if (error) throw error;
    loadData();
  });
  event.returnValue = true;
});

ipcMain.on("importFile", (event, file) => {
  storage.set("Jobs", file, (error) => {
    if (error) throw error;
    loadData();
  });
  event.returnValue = true;
});

ipcMain.on("shareDialog", async function (event) {
  let filename = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
    title: "Export Jobs",
    filters: [{ name: "Jobs File", extensions: ["json"] }],
  });
  if (!filename.canceled) {
    fs.writeFile(filename.filePath, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  }
  event.returnValue = true;
});

loadData();
