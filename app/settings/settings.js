const remote = require('electron').remote;
const app = remote.app;

const fs = require('fs')

const settings = require(app.getPath("appData") + "/gm/settings.json");

var currentView = settings.view;

$('input[value=' + currentView + ']').prop("checked", true)

$(document).on('click', '#save-button', function() {

    var view = document.querySelector('input[name="style"]:checked').value;

    var settingsObj = settings;

    settingsObj.view = view;

    console.log(app.getPath("appData") + "/gm/settings.json")

    fs.writeFile(app.getPath("appData") + "/gm/settings.json", JSON.stringify(settingsObj), 'utf8', function(err) {
        if (err) {
            console.error(err);
        }

        alert("Your settings have been saved, application will restart to apply changes")

        app.relaunch();
        app.exit();


    });
})