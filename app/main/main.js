//get icon
const remote = require('electron').remote;
const app = remote.app;

//create .png files
const fs = require('fs');

//run .exe
const child = require('child_process').execFile;

//add game to container
addGame = (file, gameIcons) => {

  //div that holds all the content
  var gameDiv = $(document.createElement('div'));
  gameDiv.addClass('game');

  //icon next to the play button
  var gameIcon = $(document.createElement('img'));
  gameIcon.addClass('game-icon');
  var iconPath = app.getPath("appData") + "/gm/icons/" + gameIcons[0].substring(0, gameIcons[0].length - 4);
  gameIcon.attr('src', iconPath + ".png");

  var gameTitle = $(document.createElement('h3'));
  gameTitle.addClass('game-title');
  if (file == "PUBG/TslGame/Binaries/Win64") {
    gameTitle.html("PUBG");
  } else {
    gameTitle.html(file);
  }

  //button to launch the game
  var playButton = $(document.createElement('input'));
  playButton.addClass('buttons');
  playButton.val('Play Game');
  playButton.attr('type', 'button')
  playButton.attr('id', gameIcons[0]);
  playButton.attr('gameName', file);

  //append all elements to the div and to the container
  $('.game-container').append(gameDiv);
  $(gameDiv).append(gameIcon);
  $(gameDiv).append(gameTitle);
  $(gameDiv).append(playButton);

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

//get path for most popular game clients
const steam = "C:/Program Files (x86)/Steam/steamapps/common/";
const origin = "C:/Program Files (x86)/Origin Games/";

//create object to hold array of icon names
let gameIcons = {};

//create folder to hold icons if it doesn't exist
if (!fs.existsSync(app.getPath("appData") + "/gm/icons/")) {
  fs.mkdirSync(app.getPath("appData") + "/gm/icons/");
}

//loops through each folder in the steam directory
fs.readdirSync(steam).forEach(file => {

  let pictureName;
  //why PUBG ;-;
  if (file == "PUBG") {
    file = file + "/TslGame/Binaries/Win64";
  }
  gameIcons[file] = [];
  //loop through every .exe in every game folder
  fs.readdirSync(steam + file).forEach(picture => {
    if (picture.substring(picture.length - 4, picture.length) == '.exe') {
      pictureName = picture;
      gameIcons[file].push(picture);
      var pathToPic = steam + file + "/" + picture;
      app.getFileIcon(pathToPic, (err, icon) => {
        console.error(err);
        gameIcons[file].push(icon.toDataURL());
        var data = icon.toDataURL().replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile(app.getPath("appData") + "/gm/icons/" + picture.substring(0, picture.length - 4) + '.png', buf);
      })
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
        console.error(err);
        gameIcons[file].push(icon.toDataURL());
        var data = icon.toDataURL().replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile(app.getPath("appData") + "/gm/icons/" + picture.substring(0, picture.length - 4) + '.png', buf);
      })
    }
  })
})

//adds game for every key (game) in the object
for (let game in gameIcons) {
  if (gameIcons[game].length != 0) {
    addGame(game, gameIcons[game]);
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
  console.log("clicked")
  var gameId = $(this).attr('id');
  var gameName = $(this).attr('gameName');
  var gamePathSteam = "C:/Program Files (x86)/Steam/steamapps/common/" + gameName + "/" + gameId;
  var gamePathOrigin = "C:/Program Files (x86)/Origin Games/" + gameName + "/" + gameId;

  //checks if game is from Origin or Steam
  if (fs.existsSync(gamePathSteam)) {
    runExe(gamePathSteam);
  } else if (fs.existsSync(gamePathOrigin)) {
    runExe(gamePathOrigin);
  }

});