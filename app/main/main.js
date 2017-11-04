//get icon
const remote = require('electron').remote;
const app = remote.app;

//create .png files
const fs = require('fs');

var cmd = require('node-cmd');

//make shortcut to run steam games
var ws = require('windows-shortcuts');

//get updated list of steam games
var request = require("request");

request({
  url: "http://api.steampowered.com/ISteamApps/GetAppList/v0002/",
  json: true
}, function (error, response, body) {

  if (!error && response.statusCode === 200) {
    fs.writeFileSync(app.getPath("appData") + "/gm/" + 'games.json', JSON.stringify(body));
  }
})

const steamGames = require(app.getPath("appData") + "/gm/" + 'games.json');

//run .exe
const child = require('child_process').execFile;
const spawn = require('child_process').spawn;

//add game to container
addGame = (file, gameIcons, parent) => {

  var isSteam = false;

  let gamePathSteam = "C:/Program Files (x86)/Steam/userdata/" + parent + '/' + gameIcons;

  if (fs.existsSync(gamePathSteam)) {
    isSteam = true;
  }
  //checks if game is from Origin or Steam

  //div that holds all the content
  var gameDiv = $(document.createElement('div'));
  gameDiv.addClass('game');
  if (isSteam) {
    gameDiv.css("background-image", "url('http://cdn.akamai.steamstatic.com/steam/apps/" + gameIcons + "/header.jpg')")
    //    background-size: 80px 60px;
    gameDiv.css("background-size", "23em 11em");
  }

  //icon next to the play button
  var gameIcon = $(document.createElement('img'));
  gameIcon.addClass('game-icon');
  if (!isSteam) {
    var iconPath = app.getPath("appData") + "/gm/icons/" + gameIcons[0].substring(0, gameIcons[0].length - 4);
    gameIcon.attr('src', iconPath + ".png");
  }

  var gameTitle = $(document.createElement('h3'));
  gameTitle.addClass('game-title');
  gameTitle.html("PUBG");
  gameTitle.html(file);


  //button to launch the game
  var playButton = $(document.createElement('input'));
  playButton.addClass('buttons');
  playButton.val('Play Game');
  playButton.attr('type', 'button')
  if (isSteam) {
    playButton.attr('id', gameIcons);
    playButton.attr('parent', parent);
  } else {
    playButton.attr('id', gameIcons[0]);
  }
  playButton.attr('gameName', file);




  //append all elements to the div and to the container
  $('.game-container').append(gameDiv);
  if (isSteam) {
    var buttonDiv = $(document.createElement('div'));
    buttonDiv.addClass('button-div');

    $(gameDiv).append(buttonDiv);
    $(buttonDiv).append(gameIcon);
    $(buttonDiv).append(gameTitle)
    $(gameDiv).append($(document.createElement('br')));
    $(gameDiv).append(playButton);;
  } else {
    $(gameDiv).append(gameIcon);
    $(gameDiv).append(gameTitle);
    $(gameDiv).append(playButton);
  }


}

//command that runs executable
function runExe(executablePath) {

  child(executablePath, function (err, data) {

    if (err) {
      console.error(err);
      return;
    }

    console.log(data.toString());

  });
}

function spawnLink(execPath) {
  var txt = app.getPath("appData");
  var txt2 = txt.slice(0, 9) + "\"" + txt.slice(9, txt.length - 16) + "\"" + txt.slice(txt.length - 16);
  cmd.run('cmd /c start ' + txt2 + "\\gm\\links\\" + execPath + '.lnk');
}

//get path for most popular game clients
const steam = "C:/Program Files (x86)/Steam/userdata/";
const origin = "C:/Program Files (x86)/Origin Games/";

//create object to hold array of icon names
let gameIcons = {};

//create folder to hold icons if it doesn't exist
if (!fs.existsSync(app.getPath("appData") + "/gm/icons/")) {
  fs.mkdirSync(app.getPath("appData") + "/gm/icons/");
}
if (!fs.existsSync(app.getPath("appData") + "/gm/links/")) {
  fs.mkdirSync(app.getPath("appData") + "/gm/links/");
}

//loops through each folder in the steam directory
fs.readdirSync(steam).every((element, index) => {
  fs.readdirSync(steam + '/' + element).forEach(picture => {
    if (!isNaN(picture) && picture != 7 && picture != 760) {
      var picked = steamGames.applist.apps.filter(app => app.appid == picture);
      addGame(picked[0].name, picture, element);
      ws.create(app.getPath("appData") + "/gm/links/", "steam://rungameid/" + picture, function (err) {
        if (err) {
          console.error(err)
        } else {
          console.log('game added')
        }
      });
    }
  })
})

//loops through each folder in the origin directory
fs.readdirSync(origin).forEach(file => {

  let pictureName;
  gameIcons[file] = [];
  fs.readdirSync(origin + file).forEach(picture => {
    if (picture.substring(picture.length - 4, picture.length) == '.exe') {
      pictureName = picture;
      gameIcons[file].push(picture);
      var pathToPic = origin + file + "/" + picture;
      app.getFileIcon(pathToPic, (err, icon) => {
        if (err) {
          console.error(err);
        }
        gameIcons[file].push(icon.toDataURL());
        var data = icon.toDataURL().replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile(app.getPath("appData") + "/gm/icons/" + picture.substring(0, picture.length - 4) + '.png', buf, function (err) {
          if (err) {
            console.error(err);
          }
        });
      })
    }
  })
})



//http://cdn.akamai.steamstatic.com/steam/apps/437570/header.jpg



//adds game for every key (game) in the object
for (let game in gameIcons) {
  if (gameIcons[game].length != 0) {
    addGame(game, gameIcons[game], "");
  }
}


//search funtion to look through all the games
$("#search-text").on("keyup", function () {
  var g = $(this).val().toLowerCase();
  $(".game .game-title").each(function () {
    var s = $(this).text().toLowerCase();
    $(this).closest('.game')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
  });

})

//runs .exe when play button is clicked
$(document).on('click', '.buttons', function () {
  var gameId = $(this).attr('id');
  var gameName = $(this).attr('gameName');
  var parent = $(this).attr('parent');
  let gamePathSteam = "C:/Program Files (x86)/Steam/userdata/" + parent + '/' + gameId;
  let gamePathOrigin = "C:/Program Files (x86)/Origin Games/" + gameName + "/" + gameId;

  //checks if game is from Origin or Steam
  if (fs.existsSync(gamePathSteam)) {
    console.log("steam")
    spawnLink(gameId);
  } else if (fs.existsSync(gamePathOrigin)) {
    console.log("origin")
    runExe(gamePathOrigin);
  }

});