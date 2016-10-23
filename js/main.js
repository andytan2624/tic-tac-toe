var GameModule = (function () {
    /**
     * Initial function to run which will hide all screens except the start screen
     */
    var init = function() {
        $('#start').show();
        $('#finish').hide();
        $('#board').hide();
    };
    /**
     * Object to keep track of the settings of the game, importantly who is the current player
     */
    var gameSettings = {
        currentPlayer: 'player1',
        player1_name: ''
    };
    /**
     * An object that a property that matches a box in the grid.
     * 0 means no one has claimed it
     * 1 means O has claimed it
     * -1 means X has claimed it
     */
    var boardValues = {
        s_0: 0,
        s_1: 0,
        s_2: 0,
        s_3: 0,
        s_4: 0,
        s_5: 0,
        s_6: 0,
        s_7: 0,
        s_8: 0
    };
    /**
     * An object that contains for every box, every combination that box belongs to to see the current score of that
     * permuation (i.e. acrossways, up and down and diagonal
     */
    var boardCombinations = function() {
        var currentBoardScores = {
            s_0: (boardValues.s_1 + boardValues.s_2) + ',' + (boardValues.s_3 + boardValues.s_6) + ',' + (boardValues.s_4 + boardValues.s_8),
            s_1: (boardValues.s_0 + boardValues.s_2) + ',' + (boardValues.s_4 + boardValues.s_7),
            s_2: (boardValues.s_1 + boardValues.s_0) + ',' + (boardValues.s_5 + boardValues.s_8) + ',' + (boardValues.s_4 + boardValues.s_6),
            s_3: (boardValues.s_4 + boardValues.s_5) + ',' + (boardValues.s_2 + boardValues.s_6),
            s_4: (boardValues.s_3 + boardValues.s_5) + ',' + (boardValues.s_1 + boardValues.s_7) + ',' + (boardValues.s_0 + boardValues.s_8) + ',' + (boardValues.s_2 + boardValues.s_6),
            s_5: (boardValues.s_3 + boardValues.s_4) + ',' + (boardValues.s_2 + boardValues.s_8),
            s_6: (boardValues.s_7 + boardValues.s_8) + ',' + (boardValues.s_0 + boardValues.s_3) + ',' + (boardValues.s_4 + boardValues.s_2),
            s_7: (boardValues.s_6 + boardValues.s_8) + ',' + (boardValues.s_1 + boardValues.s_4),
            s_8: (boardValues.s_6 + boardValues.s_7) + ',' + (boardValues.s_2 + boardValues.s_5) + ',' + (boardValues.s_0 + boardValues.s_4)
        };
        return currentBoardScores;
    };
    /**
     * This function will check whether any player has three in a row going across the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    var rowsCompleted = function() {
        var row1 = boardValues.s_0 + boardValues.s_1 + boardValues.s_2;
        var row2 = boardValues.s_3 + boardValues.s_4 + boardValues.s_5;
        var row3 = boardValues.s_6 + boardValues.s_7 + boardValues.s_8;
        if (row1 == 3 || row2 == 3 || row3 == 3) {
            return 'player1';
        }
        if (row1 == -3 || row2 == -3 || row3 == -3) {
            return 'player2';
        }

        return false;
    };
    /**
     * This function will check whether any player has three in a row going down the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    var columnsCompleted = function() {
        var col1 = boardValues.s_0 + boardValues.s_3 + boardValues.s_6;
        var col2 = boardValues.s_1 + boardValues.s_4 + boardValues.s_7;
        var col3 = boardValues.s_2 + boardValues.s_5 + boardValues.s_8;

        if (col1 == 3 || col2 == 3 || col3 == 3) {
            return 'player1';
        }

        if (col1 == -3 || col2 == -3 || col3 == -3) {
            return 'player2';
        }

        return false;
    };
    /**
     * This function will check whether any player has three in a row going diagonal the board
     * If the total for any row equals 3 or -3, it means that one player has taken three boxes in a row
     */
    var diagonalsCompleted = function() {
        var diagonal1 = boardValues.s_0 + boardValues.s_4 + boardValues.s_8;
        var diagonal2 = boardValues.s_2 + boardValues.s_4 + boardValues.s_6;

        if (diagonal1 == 3 || diagonal2 == 3) {
            return 'player1';
        }

        if (diagonal1 == -3 || diagonal2 == -3) {
            return 'player2';
        }

        return false;
    };
    /**
     * This function checks whether they are any available boxes. If there is one box that has the value of 0
     * it means it is still available to be picked
     * @returns {boolean}
     */
    var anyBoxAvailable = function() {
        if (boardValues.s_0 === 0 || boardValues.s_1 === 0 || boardValues.s_2 === 0 ||
            boardValues.s_3 === 0 || boardValues.s_4 === 0 || boardValues.s_5 === 0 ||
            boardValues.s_6 === 0 || boardValues.s_7 === 0 || boardValues.s_8 === 0 ) {
            return true;
        }
        return false;
    };
    /**
     * When a game starts, reset the game board, and show the board screen
     * Get the name of the player 1 and store it in a variable so we display on the screen
     * Also set the game so player 1 is the first player to choose
     * Also set all boxes to correct class for that player so the right symbol shows up when hovered/clicked
     */
    var startGame = function() {
        resetGame();
        $('#start').hide();
        $('#finish').hide();
        $('#board').show();
        gameSettings.player1_name = $('#player_1_name_input').val();
        $('#player1_name').html(gameSettings.player1_name);
        gameSettings.gameActive  = 1;
        $('#'+gameSettings.currentPlayer).addClass('active');
        $('#board').data('player', gameSettings.currentPlayer);
        $('.box').addClass(gameSettings.currentPlayer);
    };
    /**
     * Set all board values to 0 to reset the game
     * And remove all classes from the boxes so its a clean slate
     */
    var resetGame = function() {
        for (var key in boardValues) {
            if (boardValues.hasOwnProperty(key)) {
                boardValues[key] = 0;
            }
        }
        $('.players').removeClass('active');
        $('.box').removeClass('box-filled-1').removeClass('box-filled-2').removeClass('player1').removeClass('player2');
        gameSettings.currentPlayer = 'player1';
    };
    /**
     * Function when called will mark the selected box to have the right symbol populated
     * @param selectedBox
     */
    var boxSelected = function(selectedBox) {
        var scoreType = gameSettings.currentPlayer == 'player1' ? 1 : -1;
        boardValues[selectedBox] = scoreType;
        var boxClass = gameSettings.currentPlayer == 'player2' ? 'box-filled-2' : 'box-filled-1';
        $('#' + selectedBox).addClass(boxClass);
        // Check if there is a player who's won the game
        if (isGameover()) {
            // Find out the winner of the game, and initiate the game over function
            var winner = whoWonGame();
            gameOver(winner);
        } else {
            togglePlayer();
            if (!isGameover() && getCurrentPlayer() == 'player2') {
                player2_automatic_move();
            }
        }
    };
    /**
     * Function that will find all the available boxes left in the board and will automatically select one for
     * the second player
     */
    var player2_automatic_move = function() {
        var currentBoardCombinations = boardCombinations();

        var availableBoxes = [];
        for (var key in boardValues) {
            if (boardValues[key] === 0) {
                availableBoxes.push(key);
            }
        }
        var selected_box = 0;

        /**
         * For every available box, find if it will block Player 1 from having three in a row
         * if the line equals 2
         */
        var availableBoxScores;
        for (var i = 0; i < availableBoxes.length; i++) {
            availableBoxScores = currentBoardCombinations[availableBoxes[i]];
            if (availableBoxScores.indexOf('2') >= 0) {
                selected_box = availableBoxes[i];
                break;
            }
        }

        /**
         * If player 1 has no immediate chance of getting three in a row, put an X
         * if player 1 has a O in a row
         */
        if (selected_box === 0) {
            for (i = 0; i < availableBoxes.length; i++) {
                 availableBoxScores = currentBoardCombinations[availableBoxes[i]];
                if (availableBoxScores.indexOf('1') >= 0) {
                    selected_box = availableBoxes[i];
                    break;
                }
            }
        }

        // If there is no strategic box to mark X in, pick a random box
        if (selected_box === 0) {
            selected_box = availableBoxes[Math.round(Math.random()*(availableBoxes.length-1))];
        }
        boxSelected(selected_box);
    };
    /**
     * Change the classes so the board reflects who is the current player
     */
    var togglePlayer = function() {
        $('.players').toggleClass('active');
        $('.box').removeClass(gameSettings.currentPlayer);
        gameSettings.currentPlayer = gameSettings.currentPlayer == 'player2' ? 'player1' : 'player2';
        $('.box').addClass(gameSettings.currentPlayer);
    };
    /**
     * Check if a player has won by checking if they've won three in a row, column or diagonal
     * If there are no winners, and there's still available boxes, then return false because the game is not over
     * @returns {boolean}
     */
    var isGameover = function() {
        var rowWinner = rowsCompleted();
        var columnWinner = columnsCompleted();
        var diagonalWinner = diagonalsCompleted();
        var isThereAnyBoxAvailable = anyBoxAvailable();
        // There is no winner
        if (!rowWinner && !columnWinner && !diagonalWinner && isThereAnyBoxAvailable) {
            return false;
        }
        return true;
    };
    /**
     * The game is over, so we need to determine which player won. Otherwise its a tie
     * Return the status of the end game so we can show the finish screen
     */
    var whoWonGame = function() {
        var rowWinner = rowsCompleted();
        var columnWinner = columnsCompleted();
        var diagonalWinner = diagonalsCompleted();
        var isThereAnyBoxAvailable = anyBoxAvailable();
        if (!rowWinner && !columnWinner && !diagonalWinner && !isThereAnyBoxAvailable) {
            return 'tie';
        } else if (rowWinner == 'player1' || columnWinner == 'player1' || diagonalWinner == 'player1') {
            return 'player1';
        } else {
            return 'player2';
        }
    };
    /**
     * Function where when given a player, will set the correct class and text name on the finish board
     * @param player
     */
    var gameOver = function(player) {
        $('#start').hide();
        $('#finish').show();
        $('#board').hide();
        var className = 'screen-win-one';
        var message = "Winner";
        if (gameSettings.player1_name !== '') {
            message += ': ' + gameSettings.player1_name;
        }
        if (player == 'tie') {
            className = 'screen-win-tie';
            message = "It's a Tie!";
        } else if ( player == 'player2') {
            className = 'screen-win-two';
            message = 'Winner: Computer';
        }
        $('#finish').removeClass('screen-win-tie').removeClass('screen-win-one').removeClass('screen-win-two');
        $('.screen-win p.message').html(message);
        $('#finish').addClass(className);
    };
    var getCurrentPlayer = function() {
        return gameSettings.currentPlayer;
    };
    return {
        init: init,
        startGame: startGame,
        boxSelected: boxSelected,
        player2_automatic_move: player2_automatic_move,
        isGameover: isGameover,
        getCurrentPlayer: getCurrentPlayer
    };
})();

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
        var $el = $(this);
        if (!$el.hasClass('box-filled-1') && !$el.hasClass('box-filled-2') && !$el.hasClass('player2')) {
            var selected_box = $el.attr('id');
            GameModule.boxSelected(selected_box);
        }
    });
});

// Initiate the game straight away and show the right screen
GameModule.init();
