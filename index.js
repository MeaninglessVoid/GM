const electron = require('electron')
    // import electron from 'electron'
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const Menu = electron.Menu

// import { app, BrowserWindow, dialog, Menu } from 'electron'

//menu
/*const menu = require('./app/menu.js')

const template = menu.array();*/

//uses github repo as update server
// const GhReleases = require('electron-gh-releases')

// let options = {
//     repo: 'SamuelDub/GM',
//     currentVersion: app.getVersion()
// }

// const updater = new GhReleases(options)

// const autoUpdater = require("electron-updater").autoUpdater;

app.on('ready', function() {

    /*const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu) */

    var mainWindow = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: true
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main/main.html');

    mainWindow.focus();

    const page = mainWindow.webContents;

    // autoUpdater

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

app.on('window-all-closed', function() {
    app.quit();
});