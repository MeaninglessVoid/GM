const fs = require('fs');
const iconExtractor = require('icon-extractor');

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
  gameTitle.html(file);
  console.log(gameIcons);
  var iconPath = '../icons/' + gameIcons[0].substring(0, gameIcons[0].length - 4) + '.png';
  gameIcon.attr('src', iconPath);
  playButton.val('Play Game');
  playButton.attr('type', 'button')
  $('.game-container').append(gameDiv);
  $(gameDiv).append(gameIcon);
  $(gameDiv).append(gameTitle);
  $(gameDiv).append(playButton);
}

const steam = "C:/Program Files (x86)/Steam/steamapps/common/";
const origin = "C:/Program Files (x86)/Origin Games/";

let gameIcons = {};

fs.readdirSync(steam).forEach(file => {
  let pictureName;
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
  // console.log('Here is my context: ' + data.Context);
  // console.log('Here is the path it was for: ' + data.Path);
  var icon = data.Base64ImageData;

  fs.writeFile("./app/icons/" + data.Context.substring(0, data.Context.length - 4) + '.png', icon, 'base64', (err) => {
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