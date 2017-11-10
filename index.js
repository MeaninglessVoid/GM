const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const autoUpdater = require("electron-updater").autoUpdater;
let win;

//menu
const menu = require('./app/menu.js')

const template = menu.array();

//uses github repo as update server
// const GhReleases = require('electron-gh-releases')

// let options = {
//     repo: 'SamuelDub/GM',
//     currentVersion: app.getVersion()
// }

// const updater = new GhReleases(options)


function createDefaultWindow() {
    win = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: true
    });
    win.loadURL('file://' + __dirname + '/app/main/main.html');
    win.on('closed', () => app.quit());
  return win;
}

app.on('ready', function() {

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createDefaultWindow()
    
    setTimeout(function() {
        autoUpdater.checkForUpdates();
    }, 1000)

});

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})