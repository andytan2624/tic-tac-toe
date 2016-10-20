var GameModule = {
    /**
     * Initial function to run which will hide all screens except the start screen
     */
    init: function() {
    $('#start').show();
    $('#finish').hide();
    $('#board').hide();
    },
    /**
     * Object to keep track of the settings of the game, importantly who is the current player
     */
    gameSettings: {
        currentPlayer: 'player1',
        player1_name: '',
    },
    /**
     * An object that a property that matches a box in the grid.
     * 0 means no one has claimed it
     * 1 means O has claimed it
     * -1 means X has claimed it
     */
    boardValues: {
        s_0: 0,
        s_1: 0,
        s_2: 0,
        s_3: 0,
        s_4: 0,
        s_5: 0,
        s_6: 0,
        s_7: 0,
        s_8: 0
    },
    /**
     * This function will check whether any player has three in a row going across the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    rowsCompleted: function() {
        var row1 = this.boardValues.s_0 + this.boardValues.s_1 + this.boardValues.s_2;
        var row2 = this.boardValues.s_3 + this.boardValues.s_4 + this.boardValues.s_5;
        var row3 = this.boardValues.s_6 + this.boardValues.s_7 + this.boardValues.s_8;
        if (row1 == 3 || row2 == 3 || row3 == 3) {
            return 'player1';
        }
        if (row1 == -3 || row2 == -3 || row3 == -3) {
            return 'player2';
        }

        return false;
    },
    /**
     * This function will check whether any player has three in a row going down the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    columnsCompleted: function() {
        var col1 = this.boardValues.s_0 + this.boardValues.s_3 + this.boardValues.s_6;
        var col2 = this.boardValues.s_1 + this.boardValues.s_4 + this.boardValues.s_7;
        var col3 = this.boardValues.s_2 + this.boardValues.s_5 + this.boardValues.s_8;

        if (col1 == 3 || col2 == 3 || col3 == 3) {
            return 'player1';
        }

        if (col1 == -3 || col2 == -3 || col3 == -3) {
            return 'player2';
        }

        return false;
    },
    /**
     * This function will check whether any player has three in a row going diagonal the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    diagonalsCompleted: function() {
        var diagonal1 = this.boardValues.s_0 + this.boardValues.s_4 + this.boardValues.s_8;
        var diagonal2 = this.boardValues.s_2 + this.boardValues.s_4 + this.boardValues.s_6;

        if (diagonal1 == 3 || diagonal2 == 3) {
            return 'player1';
        }

        if (diagonal1 == -3 || diagonal2 == -3) {
            return 'player2';
        }

        return false;
    },
    /**
     * This function checks whether they are any available boxes. If there is one box that has the value of 0
     * it means it is still available to be picked
     * @returns {boolean}
     */
    anyBoxAvailable: function() {
        if (this.boardValues.s_0 == 0 || this.boardValues.s_1 == 0 || this.boardValues.s_2 == 0 ||
            this.boardValues.s_3 == 0 || this.boardValues.s_4 == 0 || this.boardValues.s_5 == 0 ||
            this.boardValues.s_6 == 0 || this.boardValues.s_7 == 0 || this.boardValues.s_8 == 0 ) {
            return true;
        }
        return false;
    },
    /**
     * When a game starts, reset the game board, and show the board screen
     * Get the name of the player 1 and store it in a variable so we display on the screen
     * Also set the game so player 1 is the first player to choose
     * Also set all boxes to correct class for that player so the right symbol shows up when hovered/clicked
     */
    startGame: function() {
        this.resetGame();
        $('#start').hide();
        $('#finish').hide();
        $('#board').show();
        this.gameSettings.player1_name = $('#player_1_name_input').val();
        $('#player1_name').html(this.gameSettings.player1_name);
        this.gameSettings.gameActive  = 1;
        $('#'+this.gameSettings.currentPlayer).addClass('active');
        $('#board').data('player', this.gameSettings.currentPlayer);
        $('.box').addClass(this.gameSettings.currentPlayer);
    },
    /**
     * Set all board values to 0 to reset the game
     * And remove all classes from the boxes so its a clean slate
     */
    resetGame: function() {
        for (var key in this.boardValues) {
            this.boardValues[key] = 0;
        }
        $('.players').removeClass('active');
        $('.box').removeClass('box-filled-1').removeClass('box-filled-2').removeClass('player1').removeClass('player2');
        this.gameSettings.currentPlayer = 'player1';
    },
    /**
     * Function when called will mark the selected box to have the right symbol populated
     * @param selectedBox
     */
    boxSelected: function(selectedBox) {
        var scoreType = this.gameSettings.currentPlayer == 'player1' ? 1 : -1;
        this.boardValues[selectedBox] = scoreType;
        var boxClass = this.gameSettings.currentPlayer == 'player2' ? 'box-filled-2' : 'box-filled-1';
        $('#' + selectedBox).addClass(boxClass);
        // Check if there is a player who's won the game
        if (this.isGameover()) {
            // Find out the winner of the game, and initiate the game over function
            var winner = this.whoWonGame();
            this.gameOver(winner);
        } else {
            this.togglePlayer();
        }
    },
    /**
     * Function that will find all the available boxes left in the board and will automatically select one for
     * the second player
     */
    player2_automatic_move: function() {
        var availableBoxes = [];
        for (var key in this.boardValues) {
            if (this.boardValues[key] == 0) {
                availableBoxes.push(key);
            }
        }
        this.boxSelected(availableBoxes[Math.round(Math.random()*(availableBoxes.length-1))]);
    },
    /**
     * Change the classes so the board reflects who is the current player
     */
    togglePlayer: function() {
        $('.players').toggleClass('active');
        $('.box').removeClass(this.gameSettings.currentPlayer);
        this.gameSettings.currentPlayer = this.gameSettings.currentPlayer == 'player2' ? 'player1' : 'player2';
        $('.box').addClass(this.gameSettings.currentPlayer);
    },
    /**
     * Check if a player has won by checking if they've won three in a row, column or diagonal
     * If there are no winners, and there's still available boxes, then return false because the game is not over
     * @returns {boolean}
     */
    isGameover: function() {
        var rowWinner = this.rowsCompleted();
        var columnWinner = this.columnsCompleted();
        var diagonalWinner = this.diagonalsCompleted();
        var anyBoxAvailable = this.anyBoxAvailable();
        // There is no winner
        if (!rowWinner && !columnWinner && !diagonalWinner && anyBoxAvailable) {
            return false;
        }
        return true;
    },
    /**
     * The game is over, so we need to determine which player won. Otherwise its a tie
     * Return the status of the end game so we can show the finish screen
     */
    whoWonGame: function() {
        var rowWinner = this.rowsCompleted();
        var columnWinner = this.columnsCompleted();
        var diagonalWinner = this.diagonalsCompleted();
        var anyBoxAvailable = this.anyBoxAvailable();
        if (!rowWinner && !columnWinner && !diagonalWinner && !anyBoxAvailable) {
            return 'tie';
        } else if (rowWinner == 'player1' || columnWinner == 'player1' || columnWinner == 'player1') {
            return 'player1';
        } else {
            return 'player2';
        }
    },
    /**
     * Function where when given a player, will set the correct class and text name on the finish board
     * @param player
     */
    gameOver: function(player) {
        console.log(player);
        $('#start').hide();
        $('#finish').show();
        $('#board').hide();
        var className = 'screen-win-one';
        var message = "Winner";
        if (this.gameSettings.player1_name != '') {
            message += ': ' + this.gameSettings.player1_name;
        }
        if (player == 'tie') {
            className = 'screen-win-tie';
            message = "It's a Tie!";
        } else if ( player == 'player2') {
            className = 'screen-win-two';
            message = 'Winner: Computer'
        }
        $('#finish').removeClass('screen-win-tie').removeClass('screen-win-one').removeClass('screen-win-two');
        $('.screen-win p.message').html(message);
        $('#finish').addClass(className);
    }
};

$(document).ready(function(){
    // When the 'New Game' button is clicked, call the startGame function
    $('.new-game-button').on('click', function() {
        GameModule.startGame();
        return false;
    });

    /** When a box has been clicked, checked it's not already been clicked. If it is available, then send the id
    * of the box to the boxSelected function
    */
    $('.box').on('click', function() {
        $el = $(this);
        if (!$el.hasClass('box-filled-1') && !$el.hasClass('box-filled-2') && !$el.hasClass('player2')) {
            selected_box = $el.attr('id');
            GameModule.boxSelected(selected_box);
            if (!GameModule.isGameover() && GameModule.gameSettings.currentPlayer == 'player2') {
                window.setTimeout(function(){
                    GameModule.player2_automatic_move()
                }, 1500);
            }
        }
    });
});

// Initiate the game straight away and show the right screen
GameModule.init();
