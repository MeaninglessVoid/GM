const electron = require('electron')
const app = electron.app;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow

//to change the bot key
const fs = require('fs')

//electron dosen't support prompts ( :( ), so I have to use another package
const prompt = require('electron-prompt')

//the about page is just the app version 11/10
function about() {
    var message = "Version: " + app.getVersion() + "\n"

    dialog.showMessageBox({
        type: 'info',
        buttons: ['Ok'],
        title: 'GM',
        message: message
    })
}

//opens the settings page
function settings() {
    let settingsWindow = new BrowserWindow({
        width: 700,
        height: 500,
        resizable: false,
        fullscreen: false,
        icon: "./icon.ico"
    })
    settingsWindow.loadURL('file://' + __dirname + '/settings/settings.html');
}

//opens the developer console
function openConsole() {
    var focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.webContents.openDevTools()
}

module.exports = {
    array: function() {

        var template = [{
                label: 'File',
                submenu: [
                    {
                        label: 'About',
                        click: function() {
                            about();
                        }
                    },
                    {
                        label: 'Settings',
                        click: function () {
                            settings();
                        }
                    },
                    {
                        type: "separator"
                    },
                    {
                        role: "quit"
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [{
                    label: 'Open Console',
                    accelerator: 'f12',
                    click: function() {
                        openConsole();
                    }
                }]
            }
        ]

        return template;

    }
}