const remote = require('electron').remote;
const app = remote.app;

const fs = require('fs')

$(document).on('click', '#save-button', function() {
    console.log('ran')

    var view = document.querySelector('input[name="style"]:checked').value;

    var settingsObj = {
        "view": view
    }

    console.log(app.getPath("appData") + "/gm/settings.json")

    fs.writeFile(app.getPath("appData") + "/gm/settings.json", JSON.stringify(settingsObj), 'utf8', function(err) {
        if (err) {
            console.error(err);
        }

        console.log("The file was saved")

        var window = remote.getCurrentWindow();
        window.close();

    });
})