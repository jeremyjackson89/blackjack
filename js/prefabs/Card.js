var GameObj = GameObj || {};

GameObj.Card = function(game, x, y, data) {
  Phaser.Sprite.call(this, game, x, y, 'cards');
  
  //some default values
  this.anchor.setTo(0.5);
  this.frame = data.frame;
  this.customData = data;
};

GameObj.Card.prototype = Object.create(Phaser.Sprite.prototype);
GameObj.Card.prototype.constructor = GameObj.Card;