const gameBoard = (function (){
  board = Array(9).fill("");
  const getBoard = () => board;
  const resetBoard = () => board = Array(9).fill("");
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

  const getResult = () => {
    if (findMatch(players.player1.getSymbol())) {
      return `${players.player1.getName() || "Player 1"} won!`;
    }

    if (findMatch(players.player2.getSymbol())) {
      return `${players.player2.getName() || "Player 2"} won!`;
    }

    if (!gameBoard.getBoard().includes("")) {
      return "Tie!";
    }

    return null;
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

    return getResult();
  };

  return { playRound, newGame, getTurn: turnController.getTurn, resetTurn: turnController.resetTurn };
})();


const displayController = (function () {
  const container = document.querySelector('.app-container');

  renderMenu();

  addGlobalEventListener('click', '.form__button--submit', (e) => {
    e.preventDefault();
    updatePlayerNames(e); 
    renderGame();
    gameController.newGame();
    displayTurn();
  });

  addGlobalEventListener('click', '.board__square', (e) => {
    let result = gameController.playRound(e.target.dataset.square);
    renderBoard();
    displayTurn();
    if (result) {
      renderGameOver(result);
      let board = container.querySelector('.board');
      board.classList.add('disabled');
    }
  });

    addGlobalEventListener('click', '.button--reset', (e) => {
      gameBoard.resetBoard();
      gameController.resetTurn();
      renderGame();
      displayTurn();
  });

    addGlobalEventListener('click', '.button--new-game', (e) => {
      gameBoard.resetBoard();
      gameController.resetTurn();
      renderMenu();
  });

  function addGlobalEventListener (type, selector, callback) {
    container.addEventListener(type, (e) => {
      if (e.target.matches(selector)) callback(e);
    })
  };

  function renderMenu () {
    menuHTML = `
            <div class="game-header container">
              <h1>Tic Tac Toe</h1>
            </div>
            <form action="">
                    <div class="form__input-group">
                        <label for="player1-input"> Player 1 name </label>
                        <input id="player1-input" type="text" name="player1" placeholder="Insert name">
                    </div>
                    <div class="form__input-group">
                        <label for="player2-input" placeholder="Insert name"> Player 2 name </label>
                        <input id="player2-input" type="text" name="player2" placeholder="Insert name">
                    </div>
                <button class="form__button--submit" type="submit"> Start Game </button>
            </form>
      `;

      container.innerHTML = menuHTML;
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
      <div class="game-header container">
        <h1> Tic Tac Toe </h1>
      </div>
        <div class="board"> </div>
        <div class="container game-display">
          <div class="game-display__players">
              <div class="game-display__player-name" data-player="1"> Player1: <p> ${players.player1.getName()} </p> </div>
              <div class="game-display__player-name" data-player="2"> Player2: <p> ${players.player2.getName()} </p> </div>
          </div>
          <div class="game-display__status"> </div>
        </div>`;
      
    
    container.innerHTML = gameHTML;
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

  function renderGameOver(result) {
    let gameDisplay = container.querySelector(".game-display");
    let status = gameDisplay.querySelector(".game-display__status");
    status.textContent = result;
    
    let gameOptionsHTML = `
    <div class="game-display__options">
        <button class="button button--reset"> Reset </button>
        <button class="button button--new-game"> New Game </button>
    </div>`;

    gameDisplay.innerHTML += gameOptionsHTML;
  }

  function displayTurn() {
    let userName;
    for (const [key, value] of Object.entries(players)) {
      if (value.getSymbol() == gameController.getTurn()) userName = value.getName() || key;
    }
    let statusDisplay = container.querySelector(".game-display__status");
    let displayText = `${userName}'s turn`;
    statusDisplay.innerHTML = displayText;
  };

})();