const {
    electron,
    app,
    BrowserWindow,
    dialog,
    Menu
} = require('electron');

const fs = require('fs')

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
    updater.install()
})

// updater.autoUpdater;

function createWindow(view) {
    var mainWindow = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: false,
        fullscreen: false,
        icon: "./icon.ico"
    })

    switch (view) {
        case "list":
            mainWindow.loadURL('file://' + __dirname + '/app/main-list/main.html');
            break;
        case "tiled":
            mainWindow.loadURL('file://' + __dirname + '/app/main/main.html');
            break;
    }

    mainWindow.focus();

    mainWindow.on('closed', () => {
        app.quit();
    })
}

function createDefaultSettings() {
    var defaultSettings = {
        "view": "list"
    }

    return defaultSettings;
}

app.on('ready', function() {

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    const settingsPath = app.getPath("appData") + "/gm/settings.json";

    if (!fs.existsSync(settingsPath)) {
        var baseSettings = createDefaultSettings();
        fs.writeFileSync(settingsPath, JSON.stringify(baseSettings), 'utf8');
    }

    const settings = require(settingsPath)
    const view = settings.view;

    createWindow(view);

});