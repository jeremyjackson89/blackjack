var GameObj = GameObj || {};

//loading the game assets
GameObj.HomeState = {
    create: function() {
        this.game.stage.backgroundColor = '#009933';

        var startStyle = { font: '10px PrStart', fill: '#fff' };
        var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'TOUCH TO START', startStyle);
        startLabel.anchor.set(0.5);

        var creditStyle = { font: '8px PrStart', fill: '#fff' };
        var creatorLabel = this.game.add.text(10, (this.game.world.height - 15), 'MYSTICJ GAMES', creditStyle);
    },
    update: function() {
        if (this.game.input.activePointer.isDown) {
            this.state.start('Game');
        }
    }
};
