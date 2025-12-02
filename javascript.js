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
      if (combination.every((element) => gameBoard.getBoard()[element] == symbol)) return combination;
    }
    
    return null;
  }

  const getResult = () => {
    let player1Win = findMatch(players.player1.getSymbol());
    if (player1Win) {
      let resultString = `${players.player1.getName() || "Player 1"} won!`;
      return { result: resultString, combination: player1Win };
    }
    
    let player2Win = findMatch(players.player2.getSymbol());
    if (player2Win) {
      let resultString = `${players.player2.getName() || "Player 2"} won!`;
      return { result: resultString, combination: player2Win };
    }

    if (!gameBoard.getBoard().includes("")) {
      return { result: "Tie!", combination: player2Win };
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
      renderGameOver(result.result, result.combination);
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
        <div class="board"></div>
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

  function renderGameOver(result, combination) {
    let gameDisplay = container.querySelector(".game-display");
    let status = gameDisplay.querySelector(".game-display__status");
    status.textContent = result;
    
    let gameOptionsHTML = `
    <div class="game-display__options">
        <button class="button button--reset"> Reset </button>
        <button class="button button--new-game"> New Game </button>
    </div>`;

    gameDisplay.innerHTML += gameOptionsHTML;
    renderLine(combination);
  }

  function displayTurn() {
    let userName;
    for (const [key, value] of Object.entries(players)) {
      if (value.getSymbol() == gameController.getTurn()) userName = value.getName() || key.charAt(0).toUpperCase() + key.slice(1);
    }
    let statusDisplay = container.querySelector(".game-display__status");
    let displayText = `${userName}'s turn`;
    statusDisplay.innerHTML = displayText;
  };

  function renderLine(combination) {
    let board = document.querySelector('.board');
    let height = board.scrollHeight;

    let lineContainer = document.createElement('div');
    lineContainer.classList.add("container", "line-container");

    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgElement.setAttribute("height", `100%`);
    svgElement.setAttribute("width", `100%`);

    let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");

    let start = ((height / 3) / 2);
    let mid = (height / 2);
    let end = (height - (height / 3) / 2);

    const lineMap = [
      // --- HORIZONTAL ROWS ---
      {
        combination: [0, 1, 2],
        attributes: { x1: start, x2: end, y1: start, y2: start }
      },
      {
        combination: [3, 4, 5],
        attributes: { x1: start, x2: end, y1: mid, y2: mid }
      },
      {
        combination: [6, 7, 8],
        attributes: { x1: start, x2: end, y1: end, y2: end }
      },

      // --- VERTICAL COLUMNS ---
      {
        combination: [0, 3, 6],
        attributes: { x1: start, x2: start, y1: start, y2: end }
      },
      {
        combination: [1, 4, 7],
        attributes: { x1: mid, x2: mid, y1: start, y2: end }
      },
      {
        combination: [2, 5, 8],
        attributes: { x1: end, x2: end, y1: start, y2: end }
      },

      // --- DIAGONALS ---
      {
        combination: [0, 4, 8],
        attributes: { x1: start, x2: end, y1: start, y2: end }
      },
      {
        combination: [2, 4, 6],
        attributes: { x1: end, x2: start, y1: start, y2: end }
      }
    ];

    for (const obj of lineMap) {
      if (combination.join() === obj.combination.join()) {
        for (const [key, value] of Object.entries(obj.attributes)) {
          lineElement.setAttribute(key, `${value}px`);
        }
      }
    }
    svgElement.appendChild(lineElement);
    board.appendChild(svgElement);
  }

})();