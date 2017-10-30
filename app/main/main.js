const fs = require('fs');
const iconExtractor = require('icon-extractor');

addGame = (file) => {
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

var pictureName;

fs.readdirSync(steam).forEach(file => {
  fs.readdirSync(steam + file).forEach(picture => {
    if (picture.substring(picture.length - 3, picture.length) == '.exe') {
      console.log(dir + picture + '.exe');
      pictureName = picture;
      iconExtractor.getIcon(picture, dir + picture + '.exe');
    }
  })
  addGame(file, picture);
})

fs.readdirSync(origin).forEach(file => {
  fs.readdirSync(dir).forEach(picture => {
    if (picture.substring(picture.length - 3, picture.length) == '.exe') {
      console.log(dir + picture + '.exe');
      pictureName = picture;
      iconExtractor.getIcon(picture, dir + picture + '.exe');
    }
  })
  addGame(file, picture);
})

iconExtractor.emitter.on('icon', function (data) {
    console.log('Here is my context: ' + data.Context);
    console.log('Here is the path it was for: ' + data.Path);
    var icon = data.Base64ImageData;

    fs.writeFile(file + '.png', icon, 'base64', (err) => {
        console.log(err);
    });

});