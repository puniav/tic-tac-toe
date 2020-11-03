var dataController = (function () {

    var data;

    return {
        init: function () {
            data = {
                0: '',
                1: '',
                2: '',
                3: '',
                4: '',
                5: '',
                6: '',
                7: '',
                8: '',
            };
        },

        checkForWinner: function (currSymbol) {
            for (var i = 0; i < 3; i++) {
                if (data[String(i)] === currSymbol &&
                    data[String(i + 3)] === currSymbol &&
                    data[String(i + 6)] === currSymbol) {
                    return true;
                }
            };

            for (var i = 0; i < 9; i += 3) {
                if (data[String(i)] === currSymbol &&
                    data[String(i + 1)] === currSymbol &&
                    data[String(i + 2)] === currSymbol) {
                    return true;
                }
            };

            if (data[String(0)] === currSymbol &&
                data[String(4)] === currSymbol &&
                data[String(8)] === currSymbol) {
                return true;
            };

            if (data[String(2)] === currSymbol &&
                data[String(4)] === currSymbol &&
                data[String(6)] === currSymbol) {
                return true;
            }

            return false;
        },

        isDraw: function () {
            for (var i = 0; i < 9; i++) {
                if (!data[String(i)]) {
                    return false;
                }
            };

            return true;
        },

        updateSymbolData: function (itemId, symbol) {
            var splitID = itemId.split("_");
            var ID = splitID[1];

            data[ID] = symbol;
        }
    }

})();

var UIController = (function () {
    var DOMStrings = {
        playArea: '.playboard',
        crossSymbol: '.symbol_cross',
        circleSymbol: '.symbol_circle',
        restartButton: '.restart__btn',
    };

    return {

        init: function () {

            var crossElement = document.querySelector(DOMStrings.crossSymbol);
            var circleElement = document.querySelector(DOMStrings.circleSymbol);

            crossElement.classList.remove("current-symbol");
            circleElement.classList.remove("current-symbol");

            crossElement.classList.remove("winner");
            circleElement.classList.remove("winner");

            crossElement.textContent = 'X';
            circleElement.textContent = 'O';

            crossElement.classList.add("current-symbol");

            var cells = document.querySelectorAll('.cell');

            var cellsArray = Array.prototype.slice.call(cells);

            cellsArray.forEach(function (current) {
                current.textContent = "";
            });
        },

        displayDraw: function () {
            var crossElement = document.querySelector(DOMStrings.crossSymbol);
            var circleElement = document.querySelector(DOMStrings.circleSymbol);

            crossElement.classList.remove("current-symbol");
            circleElement.classList.remove("current-symbol");

            crossElement.classList.add("winner");
            circleElement.classList.add("winner");

            crossElement.textContent = 'DRAW!';
            circleElement.textContent = 'DRAW!';
        },

        displayWinner: function (symbol) {

            if (symbol === 'X') {
                document.querySelector(DOMStrings.crossSymbol).classList.add("winner");
                document.querySelector(DOMStrings.crossSymbol).textContent = 'WINNER!';
            } else {
                document.querySelector(DOMStrings.circleSymbol).classList.add("winner");
                document.querySelector(DOMStrings.circleSymbol).textContent = 'WINNER!';
            }
        },

        getCellContent: function (id) {
            return document.getElementById(id).textContent;
        },

        changeSymbol: function () {

            document.querySelector(DOMStrings.crossSymbol).classList.toggle("current-symbol");
            document.querySelector(DOMStrings.circleSymbol).classList.toggle("current-symbol");
        },

        displaySymbol: function (id, symbol) {
            document.getElementById(id).textContent = symbol;
        },

        getDOMStrings: function () {
            return DOMStrings;
        },
    }

})();

var appController = (function (dataCtrl, UICtrl) {

    var currentSymbol, winnerDeclared;

    var setupEventListeners = function () {

        var DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.playArea).addEventListener("click", ctrlAddSymbol);

        document.querySelector(DOMStrings.restartButton).addEventListener("click", init);
    };

    var ctrlAddSymbol = function (event) {

        var cellId = event.target.id;
        var cellContent = UICtrl.getCellContent(cellId);

        if (!cellContent && !winnerDeclared) {
            // Show on UI
            UICtrl.displaySymbol(cellId, currentSymbol);

            // Update Data
            dataCtrl.updateSymbolData(cellId, currentSymbol)

            // Check if someone won
            if (dataCtrl.checkForWinner(currentSymbol)) {
                winnerDeclared = true;
                UICtrl.displayWinner(currentSymbol);
            } else if (dataCtrl.isDraw()) {
                UICtrl.displayDraw();
            } else {
                // Player switch
                switchCurrentSymbol();
                UICtrl.changeSymbol();
            }
        }
    };

    var switchCurrentSymbol = function () {
        currentSymbol === 'X' ? currentSymbol = 'O' : currentSymbol = 'X';
    };

    var init = function () {

        currentSymbol = 'X';
        winnerDeclared = false;

        setupEventListeners();
        dataCtrl.init();
        UICtrl.init();
    }

    return {
        init: init,
    };

})(dataController, UIController);

appController.init();