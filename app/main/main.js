const fs = require('fs');

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

const steam = "C:/Program Files (x86)/Steam/steamapps/common";
const origin = "C:/Program Files (x86)/Origin Games";

fs.readdirSync(steam).forEach(file => {
  addGame(file);
})

fs.readdirSync(origin).forEach(file => {
  addGame(file);
})
