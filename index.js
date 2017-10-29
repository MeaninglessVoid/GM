const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const Menu = electron.Menu

//uses github repo as update server
const GhReleases = require('electron-gh-releases')

let options = {
    repo: 'SamuelDub/GM',
    currentVersion: app.getVersion()
}

const updater = new GhReleases(options)

app.on('ready', function () {

    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false //,
        //frame: false
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main/main.html');

    mainWindow.focus();

    const page = mainWindow.webContents;

    page.once('did-frame-finish-load', () => {

        // Check for updates
        // `status` returns true if there is a new update available
        updater.check((err, status) => {
            if (!err && status) {
                dialog.showMessageBox({
                    type: 'question',
                    buttons: ['Yes', 'No'],
                    title: 'Confirm',
                    message: 'A new update is available, would you like to download it and restart?'
                }, function (response) {
                    if (response == 0) { // Runs the following if 'Yes' is clicked
                        mainWindow.hide();
                        downloadUpdate();
                    }
                })
            }
        })

        function downloadUpdate() {
            updater.download();
        }

        // When an update has been downloaded
        updater.on('update-downloaded', (info) => {
            // Restart the app and install the update
            updater.install()

        })

        // Access electrons autoUpdater
        updater.autoUpdater
    });

});

app.on('window-all-closed', function () {
    app.quit();
});