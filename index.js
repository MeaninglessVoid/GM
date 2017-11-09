const electron = require('electron')
const ipcMain = electron.ipcMain;
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const Menu = electron.Menu

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

const autoUpdater = require("electron-updater").autoUpdater;

function createMainWindow() {
    var win = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: true
    })

    win.loadURL('file://' + __dirname + '/app/main/main.html');

    
    win.on('closed', () => app.quit());
    
    return win;
}

app.on('ready', function() {

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createMainWindow();

    autoUpdater.checkForUpdates();

    // const page = mainWindow.webContents;


    // page.once('did-frame-finish-load', () => {

    // Check for updates
    // `status` returns true if there is a new update available
    // updater.check((err, status) => {
    //     if (!err && status) {
    //         updater.download();
    //     }
    // })

    // When an update has been downloaded
    // updater.on('update-downloaded', (info) => {
    //     dialog.showMessageBox({
    //         type: 'question',
    //         buttons: ['Yes', 'No'],
    //         title: 'Confirm',
    //         message: 'A new update has been downloaded, would you like to install it?'
    //     }, function (response) {
    //         if (response == 0) { // Runs the following if 'Yes' is clicked
    //             updater.install()
    //         }
    //     })

    // })

    // Access electrons autoUpdater
    // updater.autoUpdater;
    // });

});

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})

app.on('window-all-closed', function() {
    app.quit();
});