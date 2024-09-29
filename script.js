const GameBoard = (() => {
  let board = Array(9).fill(null);

  const getBoard = () => board; // 访问 board

  const makecell = (index, playerMaker) => {
    // 标记 board
    if (!board[index]) {
      board[index] = playerMaker;
      return true; // 标记成功
    }
    return false; // 标记失败
  };

  const reset = () => {
    // 重置 board
    board = Array(9).fill(null);
  };

  return { reset, getBoard, makecell };
})();

const player = (name, maker) => {
  return { name, maker };
};

const fraction = (() => {
  let X = 0;
  let Y = 0;
  let TIE = 0;

  const PlayerX = document.querySelector("#PLAYERX");
  const PlayerY = document.querySelector("#PLAYERY");
  const TIES = document.querySelector("#TIE");

  const AddPlayerX = () => {
    PlayerX.textContent = `PlayerX: ${++X}`; // 先自增再更新文本
  };

  const AddPlayerY = () => {
    PlayerY.textContent = `PlayerY: ${++Y}`; // 先自增再更新文本
  };

  const AddTie = () => {
    TIES.textContent = `TIE: ${++TIE}`; // 更新平局文本
  };

  return { AddPlayerX, AddPlayerY, AddTie };
})();

const GameController = (() => {
  let currentPlayer;
  let players;

  const init = () => {
    // 初始化
    players = [player("玩家一", "X"), player("玩家二", "O")];
    currentPlayer = players[0];
    GameBoard.reset();
    displayMessage("");
    render();
  };

  // 检查是否有胜者出现
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
      const [a, b, c] = pattern; // 解构赋值
      return (
        // 检查 board 中是否存在同一人的标记满足 winpatterns
        GameBoard.getBoard()[a] &&
        GameBoard.getBoard()[a] === GameBoard.getBoard()[b] &&
        GameBoard.getBoard()[a] === GameBoard.getBoard()[c]
      );
    });
  };

  const render = () => {
    const gameBoard = document.querySelector("#gameBoard");
    gameBoard.innerHTML = ""; // 清空棋盘
    GameBoard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div"); // 创建 div
      cellDiv.classList.add("cell");

      // 根据玩家的标记设置颜色
      if (cell === players[0].maker) {
        cellDiv.classList.add("player0Maker");
      } else if (cell === players[1].maker) {
        cellDiv.classList.add("player1Maker");
      }

      cellDiv.textContent = cell; // 显示标记
      cellDiv.addEventListener("click", () => makemove(index)); // 添加处理玩家移动逻辑函数
      gameBoard.appendChild(cellDiv);
    });
  };

  // 处理玩家移动
  const makemove = (index) => {
    if (GameBoard.makecell(index, currentPlayer.maker)) {
      if (checkWinner()) {
        render();
        displayMessage(`胜利者: ${currentPlayer.name}`);
        currentPlayer.name === players[0].name
          ? fraction.AddPlayerX()
          : fraction.AddPlayerY();
      } else if (GameBoard.getBoard().every((cell) => cell)) {
        // 每个单元格都被标记
        displayMessage("平局！");
        fraction.AddTie(); // 添加平局记录
      } else {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]; // 游戏正常进行，进行 currentPlayer 交换
        render(); // 渲染出标记
      }
    }
  };

  const roundOver=(Message)=>{
    overLay=document.querySelector(".overLay");
    overLay.classList.add("active");
    displayMessage(Message);
  }

  //显示信息
  const displayMessage = (message) => {
    document.getElementById("message").textContent = message;
  };

  //事件绑定
  const setEventListeners = () => {
    document.getElementById("resetButton").addEventListener("click", resetGame);
  };

  //重置游戏
  const resetGame = () => {
    init();
  };

  return { init, setEventListeners };
})();

GameController.init();
GameController.setEventListeners();
