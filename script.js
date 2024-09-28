const GameBoard = (() => {
  let board = Array(9).fill(null);

  const getBoard = () => board; //访问board

  const makecell = (index, playerMaker) => {
    //标记board
    if (!board[index]) {
      board[index] = playerMaker;
      return true; //标记成功
    }
    return false; //标记失败
  };

  const reset = () => {
    //重置board
    board = Array(9).fill(null);
  };

  return { reset, getBoard, makecell };
})();

const player = (name, maker) => {
  return { name, maker };
};

const GameController = (() => {
  let currentPlayer;
  let players;

  const init = () => {
    //初始化
    players = [player("玩家一", "X"), player("玩家二", "O")];
    currentPlayer = players[0];
    GameBoard.reset();
    displayMessage("");
    render();
  };

  //检查是否有胜者出现
  const checkWinner = () => {
    const winpatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winpatterns.some((pattern) => {
      const [a, b, c] = pattern; //解构赋值
      return (
        //检查board中是否存在同一人的标记满足winpatterns
        GameBoard.getBoard()[a] &&
        GameBoard.getBoard()[a] === GameBoard.getBoard()[b] &&
        GameBoard.getBoard()[a] === GameBoard.getBoard()[c]
      );
    });
  };

  //初始渲染
  const render = () => {
    //渲染部分
    const gameBoard = document.querySelector("#gameBoard");
    gameBoard.innerHTML = ""; //清空棋盘
    GameBoard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div"); //创建div
      cellDiv.classList.add("cell");
      currentPlayer === players[0]
        ? cellDiv.classList.add("player0Maker")
        : cellDiv.classList.add("player1Maker");
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => makemove(index)); //添加处理玩家移动逻辑函数
      gameBoard.appendChild(cellDiv);
    });
  };


  //处理玩家移动
  const makemove = (index) => {
    if (GameBoard.makecell(index, currentPlayer.maker)) {
      if (checkWinner()) {
        render();
        displayMessage(`胜利者: ${currentPlayer.name}`);
      } else if (GameBoard.getBoard().every((cell) => cell)) {
        //每个单元格都被标记
        displayMessage("平局！");
      } else {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]; //游戏正常进行，进行currentplayer交换
        render(); //渲染出标记
      }
    }
  };

  const displayMessage = (message) => {
    document.getElementById("message").textContent = message;
  };

  const setEventListeners = () => {
    document.getElementById("resetButton").addEventListener("click", resetGame);
  };

  const resetGame = () => {
    init();
  };

  return { init, setEventListeners };
})();

GameController.init();
GameController.setEventListeners();
