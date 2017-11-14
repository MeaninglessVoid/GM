const { electron, app, BrowserWindow, dialog, Menu } = require('electron');

//menu
const menu = require('./app/menu.js')

const template = menu.array();

//uses github repo as update server
const GhReleases = require('electron-gh-releases')

let options = {
    repo: 'SamuelDub/GM',
    currentVersion: app.getVersion()
}

const updater = new GhReleases(options)

// Check for updates
updater.check((err, status) => {
    if (!err && status) {
        updater.download();
    }
})

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
    dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'A new update has been downloaded, would you like to install it?'
    }, function(response) {
        if (response == 0) { // Runs the following if 'Yes' is clicked
            updater.install()
        }
    })

})

updater.autoUpdater;

function createWindow() {
    var mainWindow = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: true
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main/main.html');
    // mainWindow.loadURL('file://' + __dirname + '/app/main-list/main.html');

    mainWindow.focus();

    mainWindow.on('closed', () => {
        app.quit();
    })
}

app.on('ready', function() {

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createWindow();

});