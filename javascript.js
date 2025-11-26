const gameBoard = (function (){
  board = Array(9).fill("");
  const getBoard = () => board;
  const resetBoard = () => Array(9).fill("");
  const recordTurn = (square, symbol) => board[square] = symbol;
  return { getBoard, resetBoard, recordTurn };
})();


const players = (function (){
  function addPlayer () {
    let name = "";
    let symbol = "";
    const getName = () => name;
    const setName = (newName) => name = newName;
    const getSymbol = () => symbol;
    const setSymbol = (newSymbol) => symbol = newSymbol;

    return { getName, setName, getSymbol, setSymbol };
  }

  const player1 = addPlayer();
  const player2 = addPlayer();
  player1.setSymbol("X");
  player2.setSymbol("O");

  return { player1, player2 };
})();


const gameController = (function () {
  const wins = [
  [0,1,2], [3,4,5], [6,7,8],      // rows
  [0,3,6], [1,4,7], [2,5,8],      // columns
  [0,4,8], [2,4,6]                // diagonals
  ];

  const findMatch = (symbol) => {
    for (const combination of wins) {
      let match = true;
      for (const square of combination) {
        if (!(gameBoard.getBoard()[square] == symbol)) {
          match = false;
          break;
        } 
      }
      if (match) return true;
    }

    return false;
  }

  const determineWinner = () => {
    let winner = findMatch(players.player1.getSymbol())
    ? "player 1 wins"
    : findMatch(players.player2.getSymbol())  
      ? "player 2 wins"
      : null;

    return winner;
  }

  const turnController = (function () {
    let turn = players.player1.getSymbol();     // Player 1 starts by default
    const toggleTurn = () => {
      turn = turn == players.player1.getSymbol() ? players.player2.getSymbol() : players.player1.getSymbol();
    }
    const getTurn = () => turn;
    const resetTurn = () => turn = players.player1.getSymbol();

    return { toggleTurn, getTurn, resetTurn };
  }) ();

  const newGame = () => {
    gameBoard.resetBoard();
    turnController.resetTurn();
  };

  const playRound = (square) => {
    gameBoard.recordTurn(square, turnController.getTurn());
    turnController.toggleTurn();
    if (determineWinner()) return determineWinner();
    else if (!(gameBoard.getBoard().includes(""))) return "Tie!";
  };

  return { playRound, newGame, getTurn: turnController.getTurn };
})();


const displayController = (function () {
  const body = document.querySelector('body');

  renderMenu();

  addGlobalEventListener('click', '.form__button--submit', (e) => {
    e.preventDefault();
    updatePlayerNames(e); 
    renderGame();
    gameController.newGame();
    displayTurn();
  });

  addGlobalEventListener('click', '.board__square', (e) => {
    let winner = gameController.playRound(e.target.dataset.square);
    renderBoard();
    displayTurn();
    if (winner) {
      renderGameOver(winner);
      let board = body.querySelector('.board');
      board.classList.add('disabled');
      console.log(board);
    }
  });

  function addGlobalEventListener (type, selector, callback) {
    body.addEventListener(type, (e) => {
      if (e.target.matches(selector)) callback(e);
    })
  };

  function renderMenu () {
    menuHTML = `
        <div class="container menu-container">
            <h1>Tic Tac Toe</h1>
            <form action="">
                <div class="form__row">
                    <div class="form__input-group">
                        <label for="player1-input"> Player 1 name </label>
                        <input id="player1-input" type="text" name="player1" placeholder="Insert name">
                    </div>
                    <div class="form__input-group">
                        <label for="player2-input" placeholder="Insert name"> Player 2 name </label>
                        <input id="player2-input" type="text" name="player2" placeholder="Insert name">
                    </div>
                </div>
                <button class="form__button--submit" type="submit"> Start Game </button>
            </form>
        </div>
      `;

      body.innerHTML = menuHTML;
  };

  function updatePlayerNames (e) {
    let form = e.target.closest('form');
    let player1Name = form.elements.player1.value;
    let player2Name = form.elements.player2.value;
    players.player1.setName(player1Name);
    players.player2.setName(player2Name);
  };

  function renderGame () {
    gameHTML = `
      <div class="container game-container">
        <h1> Tic Tac Toe </h1>
        <div class="game-container__display-updates"> </div>
        <div class="game-container__display-players">
            <div data-player="1"> Player1: <p> ${players.player1.getName()} </p> </div>
            <div data-player="2"> Player2: <p> ${players.player2.getName()} </p> </div>
        </div>
      </div>
      <div class="board"> </div>`;
    
    body.innerHTML = gameHTML;
    renderBoard();
    };
    
    function renderBoard () {
      let boardElement = document.querySelector('.board');
      let squaresHTML = "";
      for(let i = 0; i < gameBoard.getBoard().length; i++) {
        if (!(gameBoard.getBoard()[i])) squaresHTML += `<button class="board__square" data-square="${i}">${gameBoard.getBoard()[i]}</button>`;
        else squaresHTML += `<button class="board__square" data-square="${i}" disabled>${gameBoard.getBoard()[i]}</button>`;
      }
      boardElement.innerHTML = squaresHTML;
    }

  function renderGameOver(winner) {
    let updatesDisplay = body.querySelector(".game-container__display-updates");
    updatesDisplay.textContent = winner;
  }

  function displayTurn() {
    let updatesDisplay = body.querySelector(".game-container__display-updates");
    let userName = Object.values(players).find((player) => player.getSymbol() == gameController.getTurn()).getName();
    let displayTurnHTML = userName + "'s" + " " + "turn"
    updatesDisplay.innerHTML = displayTurnHTML;
  };

})();