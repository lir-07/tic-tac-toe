const Player = (name, marker) => {
  return {
    name,
    marker
  };
};

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMark = (index, marker) => {
    if (board[index] !== "") {
      return false;
    };

    board[index] = marker;
    return true;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    placeMark,
    reset
  };
})();

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const startGame = (name1, name2) => {
        player1 = Player(name1 || "Player 1", "X");
        player2 = Player(name2 || "Player 2", "O");

        currentPlayer = player1;
        gameOver = false;

        Gameboard.reset();
    };

    const switchPlayer = () => {
        currentPlayer =
        currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
    const board = Gameboard.getBoard();

        return winningCombinations.some((combo) => {
        const [a, b, c] = combo;

        return (board[a] !== "" && board[a] === board[b] && board[a] === board[c]);
        });
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    const playRound = (index) => {
        if (gameOver) {
        return "Game is already over.";
        };

        if (!Gameboard.placeMark(index, currentPlayer.marker)) {
        return "That spot is already taken.";
        };

        if (checkWinner()) {
            gameOver = true;
            return `${currentPlayer.name} wins the round!`;
        };

        if (checkTie()) {
            gameOver = true;
            return "It's a tie!";
        };

        switchPlayer();

        return `${currentPlayer.name}'s turn`;
    };

    const getCurrentPlayer = () => currentPlayer;

    return {
        startGame,
        playRound,
        getCurrentPlayer
    };
})();

const DisplayController = (() => {
    const boardDiv = document.querySelector("#gameboard");
    const status = document.querySelector("#status");
    const startButton = document.querySelector("#startBtn");

    const render = () => {
        boardDiv.innerHTML = "";

        Gameboard.getBoard().forEach((cell, index) => {
            const square = document.createElement("div");

            square.classList.add("cell");
            square.textContent = cell;

            square.addEventListener("click", () => {
                const result = GameController.playRound(index);

                render();

                status.textContent = result;
            });

            boardDiv.appendChild(square);
        });
    };

    startButton.addEventListener("click", () => {
        const player1Name = document.querySelector("#player1").value;
        const player2Name = document.querySelector("#player2").value;

        GameController.startGame(player1Name, player2Name);

        status.textContent =
        `${GameController.getCurrentPlayer().name}'s turn`;

        render();
    });

})();