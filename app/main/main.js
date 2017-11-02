const remote = require('electron').remote;
const fs = require('fs');
const child = require('child_process').execFile;
const iconExtractor = require('icon-extractor');
const app = remote.app;

addGame = (file, gameIcons) => {
  var gameDiv = $(document.createElement('div'));
  var gameIcon = $(document.createElement('img'));
  var gameTitle = $(document.createElement('h3'));
  var playButton = $(document.createElement('input'));
  //<input type="button" class="buttons" id="start" value="Play Game"></input>
  gameDiv.addClass('game');
  gameIcon.addClass('game-icon');
  gameTitle.addClass('game-title');
  playButton.addClass('buttons');
  if (file == "PUBG/TslGame/Binaries/Win64") {
    gameTitle.html("PUBG");
  } else {
    gameTitle.html(file);
  }
  console.log(gameIcons);
  var iconPath = app.getPath("appData") + "/gm/icons/" + gameIcons[0].substring(0, gameIcons[0].length - 4);
  playButton.val('Play Game');
  gameIcon.attr('src', iconPath + ".png");
  playButton.attr('type', 'button')
  playButton.attr('id', gameIcons[0]);
  playButton.attr('gameName', file);
  $('.game-container').append(gameDiv);
  $(gameDiv).append(gameIcon);
  $(gameDiv).append(gameTitle);
  $(gameDiv).append(playButton);
}

function runExe(executablePath) {
  child(executablePath, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(data.toString());
  });
}

const steam = "C:/Program Files (x86)/Steam/steamapps/common/";
const origin = "C:/Program Files (x86)/Origin Games/";

let gameIcons = {};

if (!fs.existsSync(app.getPath("appData") + "/gm/icons/")) {
  fs.mkdirSync(app.getPath("appData") + "/gm/icons/");
}

fs.readdirSync(steam).forEach(file => {
  let pictureName;
  if (file == "PUBG") {
    file = file + "/TslGame/Binaries/Win64";
  }
  gameIcons[file] = [];
  fs.readdirSync(steam + file).forEach(picture => {
    if (picture.substring(picture.length - 4, picture.length) == '.exe') {
      pictureName = picture;
      gameIcons[file].push(picture);
      iconExtractor.getIcon(picture, steam + file + "/" + picture);
    }
  })
})

fs.readdirSync(origin).forEach(file => {
  let pictureName;
  gameIcons[file] = [];
  fs.readdirSync(origin + file).forEach(picture => {
    if (picture.substring(picture.length - 4, picture.length) == '.exe') {
      pictureName = picture;
      gameIcons[file].push(picture);
      iconExtractor.getIcon(picture, origin + file + "/" + picture);
    }
  })
})


for (let game in gameIcons) {
  if (gameIcons[game].length != 0) {
    addGame(game, gameIcons[game]);
  }
}

iconExtractor.emitter.on('icon', function (data) {
  var icon = data.Base64ImageData;

  console.log(app.getPath("appData") + "/gm/" + data.Context.substring(0, data.Context.length - 4) + '.png');

  fs.writeFile(app.getPath("appData") + "/gm/icons/" + data.Context.substring(0, data.Context.length - 4) + '.png', icon, 'base64', (err) => {
    console.error();
  });

});

$("#search-text").on("keyup", function () {
  var g = $(this).val().toLowerCase();
  $(".game .game-title").each(function () {
    var s = $(this).text().toLowerCase();
    $(this).closest('.game')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
  });

})

$(document).on('click', '.buttons', function () {
  console.log("clicked")
  var gameId = $(this).attr('id');
  var gameName = $(this).attr('gameName');
  var gamePathSteam = "C:/Program Files (x86)/Steam/steamapps/common/" + gameName + "/" + gameId;
  var gamePathOrigin = "C:/Program Files (x86)/Origin Games/" + gameName + "/" + gameId;

  if (fs.existsSync(gamePathSteam)) {
    runExe(gamePathSteam);
  } else if (fs.existsSync(gamePathOrigin)) {
    runExe(gamePathOrigin);
  }

});