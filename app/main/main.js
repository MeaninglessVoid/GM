const fs = require('fs');
const iconExtractor = require('icon-extractor');

addGame = (file, picture) => {
  var gameDiv = $(document.createElement('div'));
  var gameTitle = $(document.createElement('h3'));
  gameDiv.addClass('game');
  gameTitle.addClass('game-title');
  gameTitle.html(file);
  $('.game-container').append(gameDiv);
  $(gameDiv).append(gameTitle);
  console.log(file);
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
  addGame(file, pictureName);
})

console.log(gameIcons)

fs.readdirSync(origin).forEach(file => {
  let pictureName;
  fs.readdirSync(origin + file).forEach(picture => {
    if (picture.substring(picture.length - 4, picture.length) == '.exe') {
      pictureName = picture;
      iconExtractor.getIcon(picture, origin + file + "/" + picture);
    }
  })
  addGame(file, pictureName);
})

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