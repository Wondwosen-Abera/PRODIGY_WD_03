const gameBoard = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart-btn");
const singlePlayerBtn = document.getElementById("single-player-btn");
const multiPlayerBtn = document.getElementById("multi-player-btn");
const header = document.getElementById("header");
const player1Choice = document.getElementById("player1-choice");
const player2Choice = document.getElementById("player2-choice");

let currentPlayer = player1Choice.value;
let gameActive = false;
let boardState = Array(9).fill(null);
let mode = "none";
let playerMarkers = {
  player1: player1Choice.value,
  player2: player2Choice.value,
};

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function initializeGame() {
  setTimeout(() => {
    header.textContent = "Choose game mode:";
    singlePlayerBtn.disabled = false;
    multiPlayerBtn.disabled = false;
  }, 2000);
}

function startGame() {
  header.textContent = "Game on!";
  singlePlayerBtn.disabled = true;
  multiPlayerBtn.disabled = true;
  gameActive = true;
}

function checkWin() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      gameActive = false;
      if (mode === "single" && boardState[a] === playerMarkers.player2) {
        header.textContent = "Computer wins!";
      } else {
        header.textContent = `Player ${
          boardState[a] === playerMarkers.player1 ? "1" : "2"
        } wins!`;
      }
      restartBtn.disabled = false;
      return;
    }
  }
  if (boardState.every((cell) => cell !== null)) {
    gameActive = false;
    header.textContent = "It's a draw!";
    restartBtn.disabled = false;
  }
}

function handleClick(event) {
  const index = event.target.getAttribute("data-index");
  if (boardState[index] === null && gameActive) {
    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    checkWin();

    if (gameActive) {
      currentPlayer =
        currentPlayer === playerMarkers.player1
          ? playerMarkers.player2
          : playerMarkers.player1;
      if (mode === "single" && currentPlayer === playerMarkers.player2) {
        setTimeout(playAI, 1000);
      }
    }
  }
}

function playAI() {
  const emptyCells = boardState
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length === 0) {
    return;
  }

  let bestMove = findBestMove();
  boardState[bestMove] = playerMarkers.player2;
  gameBoard[bestMove].textContent = playerMarkers.player2;
  checkWin();
  if (gameActive) {
    currentPlayer = playerMarkers.player1;
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (boardState[i] === null) {
      boardState[i] = playerMarkers.player2;
      let score = minimax(boardState, 0, false);
      boardState[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board, depth, isMaximizing) {
  const winner = getWinner();

  if (winner === playerMarkers.player2) {
    return 1;
  }
  if (winner === playerMarkers.player1) {
    return -1;
  }
  if (board.every((cell) => cell !== null)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = playerMarkers.player2;
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let worstScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = playerMarkers.player1;
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        worstScore = Math.min(score, worstScore);
      }
    }
    return worstScore;
  }
}

function getWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

function restartGame() {
  boardState = Array(9).fill(null);
  gameBoard.forEach((cell) => {
    cell.textContent = "";
  });
  currentPlayer = player1Choice.value;
  playerMarkers.player1 = player1Choice.value;
  playerMarkers.player2 = player1Choice.value === "X" ? "O" : "X";
  header.textContent = "Choose game mode:";
  gameActive = false;
  singlePlayerBtn.disabled = false;
  multiPlayerBtn.disabled = false;
  restartBtn.disabled = true;
}

function chooseSinglePlayer() {
  mode = "single";
  startGame();
}

function chooseMultiPlayer() {
  mode = "multi";
  startGame();
}

gameBoard.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

restartBtn.addEventListener("click", restartGame);
singlePlayerBtn.addEventListener("click", chooseSinglePlayer);
multiPlayerBtn.addEventListener("click", chooseMultiPlayer);

initializeGame();
