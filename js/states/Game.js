var GameObj = GameObj || {};

GameObj.GameState = {
    init: function(currentLevel) {
        //constants
        this.MIN_INDEX = 0;
        this.MAX_INDEX = 51;
        this.BETTING_AMOUNTS = ['5', '10', '25', '100'];
    },
    create: function() {
        this.player = {
            balance: 400,
            bet: 0,
            hand: []
        };

        this.dealerHand = [];
        this.cards = this.add.group();
        
        this.setDeck();
        this.setChips();
        
        this.makeGUI();
        this.startGame();
    },
    startGame: function(){

    },
    update: function() {

        this.refreshGUI();
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
    setChips: function(){
        this.blackChip = this.game.add.sprite(100, 100, 'blackChip');
        this.blackChip.anchor.setTo(0.5);

        this.whiteChip = this.game.add.sprite(200, 100, 'whiteChip');
        this.whiteChip.anchor.setTo(0.5);
        
        this.greenChip = this.game.add.sprite(400, 100, 'greenChip');
        this.greenChip.anchor.setTo(0.5);

        this.redChip = this.game.add.sprite(300, 100, 'redChip');
        this.redChip.anchor.setTo(0.5);
    },
    makeGUI: function() {
        var style = { font: '8px PrStart', fill: '#fff' };

        this.balanceLabel = this.add.text(250, 400, 'BALANCE:', style);
        this.balanceValue = this.add.text(250, 420, '', style);

        this.betLabel = this.add.text(this.game.world.centerX, 400, 'BET:', style);
        this.betValue = this.add.text(this.game.world.centerX, 420, '', style);

        this.refreshGUI();
    },
    refreshGUI: function() {
        this.balanceValue.text = "$" + this.formatNumber(this.player.balance);
        this.betValue.text = "$" + this.formatNumber(this.player.bet);
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
        var y = this.game.world.centerY + 25;
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