var GameObj = GameObj || {};

GameObj.GameState = {
    init: function() {
        //constants
        this.MAX_VALUE = 21;
        this.MIN_INDEX = 0;
        this.MAX_INDEX = 51;
        this.BACK_OF_CARD = 52;
        this.STARTING_BALANCE = 500;
    },

    create: function() {
        this.background = this.game.add.sprite(0, 0, 'table');
        this.dealCardSound = this.add.audio('dealingCard');
        this.coinSound = this.add.audio('coins');
        this.dealCardSound.allowMultiple = true;

        this.player = {
            balance: this.STARTING_BALANCE,
            bet: 0,
            hand: [],
            totalCardValues: ''
        };

        this.dealer = {
            hand: [],
            totalCardValues: '',
            finalDraw: false
        };

        this.isAlertPanelOpen = false;
        this.cards = this.add.group();

        this.setChips();
        this.makeGUI();
    },

    update: function() {
        this.balanceValue.text = "$" + this.formatNumber(this.player.balance);
        this.betValue.text = "$" + this.formatNumber(this.player.bet);
        this.playerCardValues.text = this.player.totalCardValues;
        this.dealerCardValues.text = this.dealer.totalCardValues;

        if (this.isAlertPanelOpen || this.alertsPanelGroup.y < this.game.height) {
            //kill cards, hide total card values, and switch buttons
            if (this.game.input.activePointer.isDown) {
                this.alertsPanelGroup.y = this.game.height;
                this.isAlertPanelOpen = false;
                this.player.totalCardValues = '';
                this.dealer.totalCardValues = '';

                this.hitButton.visible = false;
                this.standButton.visible = false;

                this.dealButton.visible = true;
                this.clearBetButton.visible = true;

                this.cards.removeAll();
            }
        }
    },

    setDeck: function() {
        this.deck = [];
        var suitSuffix = ['c', 'd', 'h', 's'];

        for (var i = 1; i < 14; i++) {
            suitSuffix.forEach(function(suit) {
                this.deck.push(i + suit);
            }, this);
        }
    },

    setChips: function() {
        var chips = JSON.parse(this.game.cache.getText('chips'));

        for (key in chips) {
            var chip = chips[key];
            this[key] = this.game.add.sprite(chip.x, chip.y, key);
            this[key].anchor.setTo(0.5);
            this[key].customData = { value: chip.value };
            this[key].inputEnabled = true;
            this[key].events.onInputDown.add(this.placeBet, this);
        }
    },

    placeBet: function(chip) {
        if (this.isAlertPanelOpen || this.alertsPanelGroup.y < this.game.height || !this.dealButton.visible) {
            return;
        }

        var balanceDifference = this.player.balance - chip.customData.value;

        if (balanceDifference >= 0) {
            this.player.bet += chip.customData.value;
            this.player.balance -= chip.customData.value;
            this.coinSound.play();
        } else {
            var message = 'Insufficient balance';
            this.alertPlayer(message);
        }
    },

    dealCards: function() {
        if (this.player.bet == 0) {
            var message = 'You must place a bet!';
            this.alertPlayer(message);
        } else {
            this.resetHands();

            this.dealButton.visible = false;
            this.clearBetButton.visible = false;

            this.game.time.events.add(500, this.getPlayerCard, this);
            this.game.time.events.add(1000, this.getDealerCard, this);
            this.game.time.events.add(1500, this.getPlayerCard, this);
            this.game.time.events.add(2000, this.getDealerCard, this);
            this.game.time.events.add(2250, this.displayDecisionButtons, this);
            this.game.time.events.add(2250, this.getPlayerCardValues, this);
        }
    },

    checkCards: function() {
        if (this.isAlertPanelOpen) return;

        this.dealer.hand[1].frame = this.dealer.hand[1].customData.frame;
        this.getDealerCardValues();

        if (this.dealer.totalCardValues < this.MAX_VALUE && !this.dealer.finalDraw) {
            this.dealer.finalDraw = true;
            this.game.time.events.add(250, this.getDealerCard, this);
        } else {
            var reason;
            if (this.player.totalCardValues == this.dealer.totalCardValues) {
                this.handleDraw();
            } else if (this.player.totalCardValues >= this.dealer.totalCardValues || this.dealer.totalCardValues > this.MAX_VALUE) {
                reason = (this.player.totalCardValues >= this.dealer.totalCardValues ? 'You beat the dealer!' : 'Dealer bust!');
                this.handlePlayerWin(reason);
            } else if (this.dealer.totalCardValues == 21 || this.dealer.totalCardValues > this.player.totalCardValues) {
                reason = 'Dealer win!';
                this.handlePlayerLoss(reason);
            }
        }

    },

    resetHands: function() {
        this.player.hand = [];
        this.dealer.hand = [];
        this.dealer.finalDraw = false;
        this.setDeck();
    },

    getPlayerCard: function() {
        if (this.isAlertPanelOpen) return;

        var card = this.getRandomCard();
        card.x = this.game.world.centerX + (25 * this.player.hand.length);
        card.y = this.game.world.centerY - 20;
        this.player.hand.push(card);

        if (this.player.hand.length > 2) {
            this.getPlayerCardValues();
        }
    },

    getDealerCard: function() {
        var card = this.getRandomCard();
        card.x = this.game.world.centerX + (25 * this.dealer.hand.length);
        card.y = 120;
        this.dealer.hand.push(card);

        if (this.dealer.hand.length == 2) {
            card.frame = this.BACK_OF_CARD;
        }

        if (this.dealer.finalDraw) {
            this.checkCards();
        }
    },

    clearBet: function() {
        this.player.balance += this.player.bet;
        this.player.bet = 0;
    },

    displayDecisionButtons: function() {
        this.hitButton.visible = true;
        this.standButton.visible = true;
    },

    getPlayerCardValues: function() {
        this.player.totalCardValues = '';
        this.player.totalCardValues = this.getHandValue(this.player.hand);

        var reason;
        if (this.player.totalCardValues == 21) {
            reason = '21!';
            this.handlePlayerWin(reason);
        } else if (this.player.totalCardValues > 21) {
            reason = 'bust';
            this.handlePlayerLoss(reason);
        }
    },

    getDealerCardValues: function() {
        this.dealer.totalCardValues = '';
        this.dealer.totalCardValues = this.getHandValue(this.dealer.hand);
    },

    getHandValue: function(hand) {
        var totalValue = 0;
        var aces = 0;

        hand.forEach(function(card) {
            if (card.customData.isAce) {
                aces++;
            } else {
                totalValue += card.customData.primaryValue;
            }
        }, this);

        if (aces > 0) {
            for (var i = 0; i < aces; i++) {
                valueWithAce = totalValue + 11;
                totalValue += (valueWithAce > this.MAX_VALUE ? 1 : 11);
            }
        }

        return totalValue;
    },

    makeGUI: function() {
        //Text
        var style = { font: '11px PrStart', fill: '#fff' };
        var betStyle = { font: '9px PrStart', fill: '#fff' };

        this.balanceLabel = this.add.text(250, 500, 'BALANCE:', style);
        this.balanceValue = this.add.text(250, 520, '', style);

        this.betValue = this.add.text(this.game.world.centerX + 15, 410, '', betStyle);
        this.betValue.anchor.setTo(0.5);

        this.playerCardValues = this.add.text(this.game.world.centerX, this.game.world.centerY - 80, '', style);
        this.playerCardValues.anchor.setTo(0.5);

        this.dealerCardValues = this.add.text(this.game.world.centerX, 185, '', style);
        this.dealerCardValues.anchor.setTo(0.5);

        //buttons when placing bet
        this.dealButton = this.game.add.button(300, 400, 'dealButton', this.dealCards, this);
        this.dealButton.anchor.setTo(0.5);

        this.clearBetButton = this.game.add.button(300, 460, 'clearBetButton', this.clearBet, this);
        this.clearBetButton.anchor.setTo(0.5);

        //buttons when playing
        this.hitButton = this.game.add.button(300, 400, 'hitButton', this.getPlayerCard, this);
        this.hitButton.anchor.setTo(0.5);
        this.hitButton.visible = false;

        this.standButton = this.game.add.button(300, 460, 'standButton', this.checkCards, this);
        this.standButton.anchor.setTo(0.5);
        this.standButton.visible = false;

        //alert panel
        this.overlay = this.add.bitmapData(this.game.width, this.game.height / 2);
        this.overlay.ctx.fillStyle = '#000';
        this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height / 2);

        this.alertsPanelHeight = 90;

        this.alertsPanelGroup = this.add.group();
        this.alertsPanelGroup.y = this.game.height;
        this.alertsPanel = new Phaser.Sprite(this.game, 0, this.alertsPanelHeight, this.overlay);
        this.alertsPanel.alpha = 0.8;
        this.alertsPanel.fixedToCamera = true;
        this.alertsPanelGroup.add(this.alertsPanel);

        //panel content
        panelStyle = { font: '15px PrStart', fill: '#fff' };
        this.alertsInfoHeight = 180;

        this.alertInfo = new Phaser.Text(this.game, this.game.world.centerX, this.alertsInfoHeight, '', panelStyle);
        // this.alertInfo.fixedToCamera = true;
        this.alertInfo.anchor.setTo(0.5);
        this.alertsPanelGroup.add(this.alertInfo);

        this.alertInfoReason = new Phaser.Text(this.game, this.game.world.centerX, this.alertsInfoHeight + 40, '', panelStyle);
        this.alertInfoReason.fixedToCamera = true;
        this.alertInfoReason.anchor.setTo(0.5);
        this.alertsPanelGroup.add(this.alertInfoReason);

        this.alertContinueText = new Phaser.Text(this.game, this.game.world.centerX, this.alertsInfoHeight + 150, 'CLICK TO CONTINUE', style);
        this.alertContinueText.fixedToCamera = true;
        this.alertContinueText.anchor.setTo(0.5);
        this.alertsPanelGroup.add(this.alertContinueText);
    },

    formatNumber: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    initializeEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    },

    getRandomCard: function() {
        this.dealCardSound.play();
        var randomIndex = Math.floor(Math.random() * (this.MAX_INDEX - this.MIN_INDEX + 1)) + this.MIN_INDEX;
        var card = null;

        if (!this.deck[randomIndex]) {
            return this.getRandomCard();
        } else {
            var cardData = this.getCardData(randomIndex);

            var found = this.cards.filter(function(child, index, children) {
                return (child.customData.primaryValue == cardData.primaryValue &&
                    child.customData.suit == cardData.suit &&
                    child.customData.isRoyal == cardData.isRoyal);
            }, true);

            if (found.list.length > 0) {
                card = found.list[0];
            } else {
                var x = 0;
                var y = 0;
                card = new GameObj.Card(this.game, x, y, cardData);
                this.cards.add(card);
            }
            return card;
        }
    },

    getCardData: function(randomIndex) {
        var card = this.deck[randomIndex];
        this.deck[randomIndex] = false;

        var cardData = {
            frame: randomIndex,
            suit: '',
            primaryValue: 0,
            secondaryValue: 0,
        };

        var suitSuffix = card.substr(-1);
        cardData.suit = this.getCardSuit(suitSuffix);

        var cardValue = parseInt(card.substring(0, card.length - 1));

        cardData.primaryValue = cardValue;
        cardData.isAce = false;
        cardData.isRoyal = false;

        if (cardValue == 1) {
            cardData.primaryValue = 1;
            cardData.secondaryValue = 11;
            cardData.isAce = true;
        } else if (cardValue >= 10) {
            cardData.primaryValue = 10;
            cardData.isRoyal = cardValue;
        }

        return cardData;
    },

    getCardSuit: function(suitSuffix) {
        switch (suitSuffix) {
            case 'c':
                return 'Clubs';
            case 'd':
                return 'Diamonds';
            case 'h':
                return 'Hearts';
            default:
                return 'Spades';
        }
    },

    alertPlayer: function(title, message) {
        this.isAlertPanelOpen = true;
        this.alertInfoReason.text = '';
        this.alertInfo.text = title.toUpperCase();
        if (message) this.alertInfoReason.text = message.toUpperCase();
        var showAlertPanelTween = this.add.tween(this.alertsPanelGroup);
        showAlertPanelTween.to({ y: 0 }, 150);
        showAlertPanelTween.start();
    },

    handlePlayerWin: function(reason) {
        this.alertPlayer('You won', reason);
        this.player.balance += (this.player.bet * 2);
        this.player.bet = 0;
    },

    handlePlayerLoss: function(reason) {
        this.alertPlayer('You lost', reason);
        this.player.bet = 0;
        if (this.player.balance < 5) {
            this.player.balance = this.STARTING_BALANCE;
        }
    },

    handleDraw: function() {
        this.alertPlayer('Draw');
        this.player.balance += this.player.bet;
        this.player.bet = 0;
    }
};
