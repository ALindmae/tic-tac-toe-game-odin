const gameBoard = (function (){
  board = [];     // Array(9).fill(null);
  const getBoard = () => board;
  const recordTurn = () => board.push(window.prompt("Insert X or O"));
  return { getBoard, recordTurn };
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
    let winner = findMatch("X")
    ? "player 1 wins"
    : findMatch("O")  
      ? "player 2 wins"
      : null;

    return winner;
  }

  const playGame = () => {
    while(gameBoard.getBoard().length < 9) {
      if (determineWinner()) return determineWinner();
      else gameBoard.recordTurn();
    }

    return determineWinner();
  }
  
  return { playGame };
})();

const displayController = (function () {
  console.log(gameController.playGame());
  console.log(gameBoard.getBoard());
})();

