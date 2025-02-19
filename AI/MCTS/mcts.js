const { checkWin } = require("../fcSupport/checkWin/index");

module.exports = {
  MCTS: (board, player, iterations) => {
    const opponent = player === "X" ? "O" : "X";

    //lấy các nước đi có thể đi
    const getAvailableMoves = (board) => {
      return board
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);
    };

    //kiểm tra kết thúc
    const isGameOver = (board) =>
      checkWin(board) !== null || getAvailableMoves(board).length === 0;

    //Mô phỏng
    const simulate = (board, currentPlayer) => {
      let currentBoard = board.slice();
      let turn = currentPlayer;

      while (!isGameOver(currentBoard)) {
        const moves = getAvailableMoves(currentBoard);

        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        currentBoard[randomMove] = turn;
        turn = turn === "X" ? "O" : "X";
      }

      return checkWin(currentBoard);
    };

    const moves = getAvailableMoves(board);
    const scores = moves.map(() => 0); //đánh dấu các nước đi khả dĩ với số điểm khởi đầu là 0

    for (let i = 0; i < iterations; i++) {
      const moveIndex = Math.floor(Math.random() * moves.length); // chọn nước đi để mở rộng
      const move = moves[moveIndex];
      const newBoard = board.slice();
      newBoard[move] = player;

      const winner = simulate(newBoard, opponent);
      if (winner === player) scores[moveIndex]++; // nếu O thắng +1 điểm
      if (winner === opponent) scores[moveIndex]--; // nếu X thắng -1 điểm
    }

    const bestMoveIndex = scores.indexOf(Math.max(...scores)); // tìm số điểm cao nhất cũng là nước đi tốt nhất
    return moves[bestMoveIndex];
  },
};
