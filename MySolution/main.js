const { app, BrowserWindow } = require("electron");

const isNotMac = process.platform !== "darwin";

const createWindow = () => {
  const win = new BrowserWindow({
    title: "WeatherCast",
    width: 1100,
    height: 900,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'self';",
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("active", () => {
    if (BrowserWindow.getAllWindows.length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (isNotMac) {
    app.quit();
  }
});
