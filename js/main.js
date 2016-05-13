var GameObj = GameObj || {};

// GameObj.game = new Phaser.Game(320, 480, Phaser.AUTO);
GameObj.game = new Phaser.Game(360, 640, Phaser.AUTO);

GameObj.game.state.add('Boot', GameObj.BootState); 
GameObj.game.state.add('Preload', GameObj.PreloadState); 
GameObj.game.state.add('Home', GameObj.HomeState);
GameObj.game.state.add('Game', GameObj.GameState);

GameObj.game.state.start('Boot'); 
