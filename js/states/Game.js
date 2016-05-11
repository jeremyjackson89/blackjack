var GameObj = GameObj || {};

GameObj.GameState = {
    init: function(currentLevel) {
        //constants
        this.MIN_INDEX = 0;
        this.MAX_INDEX = 51;
        this.BETTING_AMOUNTS = ['5', '10', '25', '100'];
    },
    create: function() {
        //background
        // this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, '');

        this.cards = this.add.group();
        this.setDeck();

        //GUI
        this.makeGUI();
    },
    update: function() {

    },
    setDeck: function(){
        this.deck = [];
        var suitSuffix = ['c', 'd', 'h', 's'];

        for(var i = 1; i < 14; i++){
            suitSuffix.forEach(function(suit){
                this.deck.push(i + suit);
            }, this);
        }
    },
    makeGUI: function() {
        //data panel GUI
        // var style = { font: '8px PrStart', fill: '#fff' };
        // var levelStyle = { font: '12px PrStart', fill: '#fff' };
        // this.dataPanel = this.add.sprite(0, 0, 'dataPanel');
        // this.dataPanel.alpha = 0.6;
        // this.playerFace = this.add.sprite(5, 5, 'bardockFace');

        // this.healthLabel = this.add.text(50, 7, 'HEALTH:', style);
        // this.healthStats = this.add.text(110, 7, '', style);

        // this.energyLabel = this.add.text(50, 17, 'ENERGY:', style);
        // this.energyStats = this.add.text(110, 17, '', style);

        // this.powerLevelLabel = this.add.text(50, 37, 'POWER LEVEL', style);
        // this.powerLevelStats = this.add.text(50, 47, '', style);

        // this.defeatedLabel = this.add.text(5, 67, 'ENEMIES DEFEATED', style);
        // this.defeatedStats = this.add.text(5, 77, '', style);

        // this.levelLabel = this.add.text(this.game.world.centerX - 10, this.game.world.centerY, '', levelStyle);
        // this.levelLabel.anchor.setTo(0.5);
        // this.refreshStats();
    },
    refreshStats: function() {
        this.healthStats.text = this.player.customData.health + '/' + this.player.customData.maxHealth;
        this.energyStats.text = this.player.customData.energy + '/' + this.player.customData.maxEnergy;
        this.powerLevelStats.text = this.formatNumber(this.player.customData.powerLevel);
        this.defeatedStats.text = this.formatNumber(this.player.customData.enemiesDefeated);
    },
    formatNumber: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    initializeEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    },
    getRandomCard: function() {
        var randomIndex = Math.floor(Math.random() * (this.MAX_INDEX - this.MIN_INDEX + 1)) + this.MIN_INDEX;
        var card = null;

        if(!this.deck[randomIndex]) return this.getRandomCard();

        var cardData = this.getCardData(randomIndex);
        this.deck[randomIndex] = false;
        var x = this.game.world.centerX + 15 * this.cards.children.length;
        var y = this.game.world.centerY;
        card = new GameObj.Card(this.game, x, y, cardData);
        this.cards.add(card);
    },
    getCardData: function(randomIndex){

        var cardData = {
            frame: randomIndex,
            suit: '',
            primaryValue: 0,
            secondaryValue: 0,
        };

        var card = this.deck[randomIndex];
        var suitSuffix = card.substr(-1);

        switch(suitSuffix){
            case 'c':
                cardData.suit = 'Clubs';
                break;
            case 'd':
                cardData.suit = 'Diamonds';
                break;
            case 'h':
                cardData.suit = 'Hearts';
                break;
            default:
                cardData.suit = 'Spades';
        }

        var cardValue = parseInt(card.substring(0, card.length - 1));
        
        cardData.primaryValue = cardValue;
        
        if(cardValue == 1){
            cardData.primaryValue = 1;
            cardData.secondaryValue = 11;
        } else if (cardValue >= 10) {
            cardData.primaryValue = 10;
        }

        return cardData;

    },
    handleGameOver: function() {
       
    }
};