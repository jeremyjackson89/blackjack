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
    this.load.image('blackChip', 'assets/images/black-chip.png');
    this.load.image('whiteChip', 'assets/images/white-chip.png');
    this.load.image('redChip', 'assets/images/red-chip.png');
    this.load.image('greenChip', 'assets/images/green-chip.png');
  },
  create: function() {
    this.state.start('Home');
  }
};