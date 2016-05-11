var GameObj = GameObj || {};

//loading the game assets
GameObj.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);

    this.load.setPreloadSprite(this.preloadBar);

    //sprite sheets
    this.load.atlasJSONHash('cards', 'assets/images/cards-spritesheet.png', 'assets/images/card-spritesheet.json');
  },
  create: function() {
    this.state.start('Home');
  }
};