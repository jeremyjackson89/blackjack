var GameObj = GameObj || {};

//loading the game assets
GameObj.HomeState = {
    create: function() {
        this.game.stage.backgroundColor = '#007F0E';

        var titleStyle = { font: '25px PrStart', fill: '#fff' };
        var titleLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'BLACKJACK', titleStyle);
        titleLabel.anchor.set(0.5);

        var startStyle = { font: '10px PrStart', fill: '#fff' };
        var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'CLICK TO START', startStyle);
        startLabel.anchor.set(0.5);

        var creditStyle = { font: '8px PrStart', fill: '#fff' };
        var creatorLabel = this.game.add.text(10, (this.game.world.height - 15), 'JEREMY JACKSON', creditStyle);
    },
    update: function() {
        if (this.game.input.activePointer.isDown) {
            this.state.start('Game');
        }
    }
};
