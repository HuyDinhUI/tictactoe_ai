const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
      origin: "*",
  }
});

const data_room=[]

app.get("/", (req, res) => {
  res.send("Server is running");
});

const player={}

function handle_winner_5x5(board) {

  // Hàm con kiểm tra k ô liên tiếp giống nhau trong mảng
  const size=Math.sqrt(board.length)
  if (size == 3){
    var k=3
  } else if (size==4) {
    var k=4
  } else {var k=5}
  function checkLine(line) 
  {
      
      let count = 0;

      for (let i=0;i<line.length;i++) 
      {
            
            if (line[i] == 'X')
            {
              count++
              
              if (count==k){
                return 'X'
              }
              
            } else count=0 
      }

      if (count!=k) count=0 

      for (let i=0;i<line.length;i++) 
      {
          
        if (line[i] === 'O')
        {
          count++
        } else count=0

        if (count===k)
        {
            
            return 'O'
        }

      }
      return null;
  }

  // Kiểm tra các hàng
  for (let row = 0; row < size; row++) {
      let line = [];
      for (let col = 0; col < size; col++) {
          line.push(board[row * size+ col]);
      }
      if (checkLine(line)) return checkLine(line)
  }

  // Kiểm tra các cột
  for (let col = 0; col < size; col++) {
      let line = [];
      for (let row = 0; row < size; row++) {
          line.push(board[row * size + col]);
      }
      if (checkLine(line)) return checkLine(line)
  }

  // Kiểm tra đường chéo chính (từ trái trên xuống phải dưới)
  for (let start = 0; start <= size - k; start++) {
      // Đường chéo từ phía trên
      let line1 = [];
      let line2 = [];
      for (let i = 0; i < size - start; i++) {
          line1.push(board[(start + i) * size + i]); // Đường chéo từ trên xuống
          line2.push(board[i * size + (start + i)]); // Đường chéo từ trái sang phải
      }
      
      if (checkLine(line1) || checkLine(line2)) return checkLine(line1)
  }

  // Kiểm tra đường chéo phụ (từ phải trên xuống trái dưới)
  for (let start = 0; start <= size - k; start++) {
      // Đường chéo từ phía trên
      let line1 = [];
      let line2 = [];
      for (let i = 0; i < size - start; i++) {
          line1.push(board[(start + i) * size + (size - 1 - i)]); // Đường chéo phụ từ trên xuống
          line2.push(board[i * size + (size - 1 - start - i)]); // Đường chéo phụ từ phải sang trái
      }
      
      if (checkLine(line1) || checkLine(line2)) return checkLine(line1)
  }

return null
  

}


//Hàm kiểm trả hòa
const isBoardFull = (board) => {
  return board.every(cell => cell !== null);
}

//Hàm tính điểm
const evaluate = (board) => {
  if (handle_winner_5x5(board)==='O') return 10; // người thắng
  if (handle_winner_5x5(board)==='X') return -10; // máy thắng
  return 0;
}

const minimax = (board, depth, isMaximizing,alpha,beta) => {
  const score = evaluate(board);
  
  //Nếu "O" hoặc người chơi thắng
  if (score === 10) return 10-depth;
  if (score === -10) return depth-10;

  //Nếu bàn cờ đầy (hoà)
  if (isBoardFull(board)) return 0;
  

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let sr=minimax(board, depth + 1, false,alpha,beta)
        best = Math.max(best,sr)
        board[i] = null
        //alpha-beta
        alpha=Math.max(alpha,best)
        if (beta <= alpha) break
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let sr=minimax(board, depth + 1, true,alpha,beta)
        best = Math.min(best,sr);
        board[i] = null;
        //alpha-beta
        beta=Math.min(beta,best)
        if (beta <=alpha) break

      }
    }
    return best;
  }
}

const findBestMove_AI_hard = (board) => {
  let bestVal = -Infinity;
  let bestMove = -1;
    
    
  for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const moveVal =  minimax(board, 0, false,-Infinity,Infinity);
        board[i] = null;
    
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
    }
  }
  
  return bestMove;
}

const evaluateBoard = (board) => {
    const lines = [];
    const n=board.length
    // Hàng ngang
    for (let row = 0; row < n; row++) {
      const rowStart = row * n;
      const rowEnd = rowStart + n;
      lines.push(board.slice(rowStart, rowEnd));
    }

    // Hàng dọc
    for (let col = 0; col < n; col++) {
      let column = [];
      for (let row = 0; row < n; row++) {
        column.push(board[row * n + col]);
      }
      lines.push(column);
    }

    // Đường chéo chính
    let mainDiagonal = [];
    for (let i = 0; i < n; i++) {
      mainDiagonal.push(board[i * n + i]);
    }
    lines.push(mainDiagonal);

    // Đường chéo phụ
    let antiDiagonal = [];
    for (let i = 0; i < n; i++) {
      antiDiagonal.push(board[i * n + (n - i - 1)]);
    }
    lines.push(antiDiagonal);

    // Tính điểm cho từng dãy
    let score = 0;
    lines.forEach(line => {
      const XCount = line.filter(cell => cell === "X").length;
      const OCount = line.filter(cell => cell === "O").length;

      if (XCount===2) score+=80
      if (OCount===5) score+=120
      if (OCount===4) score+=90
      if (XCount===5) score+=100
      if (OCount===0) score+=70 

    });

    return score;
  };

const MCTS = (board, player, iterations ) => {
  const opponent = player === "X" ? "O" : "X";

  //lấy các nước đi có thể đi
  const getAvailableMoves = (board) => {
    return board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
  };


  //kiểm tra kết thúc
  const isGameOver = (board) => handle_winner_5x5(board) !== null || getAvailableMoves(board).length === 0;

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

    return handle_winner_5x5(currentBoard);
  };

  const moves = getAvailableMoves(board);
  const scores = moves.map(() => 0); //đánh dấu các nước đi khả dĩ với số điểm khởi đầu là 0

  for (let i = 0; i < iterations; i++) {
    const moveIndex = Math.floor(Math.random() * moves.length);// chọn nước đi để mở rộng
    const move = moves[moveIndex];
    const newBoard = board.slice();
    newBoard[move] = player;

    const winner = simulate(newBoard, opponent);
    if (winner === player) scores[moveIndex]++; // nếu O thắng +1 điểm
    if (winner === opponent) scores[moveIndex]--;// nếu X thắng -1 điểm
  }

  const bestMoveIndex = scores.indexOf(Math.max(...scores)); // tìm số điểm cao nhất cũng là nước đi tốt nhất
  return moves[bestMoveIndex];
};

socketIo.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.emit("getId", socket.id);
  
  
  socket.on("getDataRoom",function(data){
    console.log(data)
    socketIo.emit("sendDataRoom",data)
  })

  socket.on("sendDataClient", function(data) {
    console.log(data)
    
    socketIo.emit("sendDataServer", data);
  })

  socket.on("AImove",function(data){
    const bestmove=MCTS(data.newboard,data.player,data.iterations)
    socketIo.emit("Sendbestmove",bestmove)
  })

  socket.on("disconnect", () => {
    
    console.log("User disconnected:", socket.id);
  });

  
});



const PORT = 4000;
server.listen(PORT, () => {
  
  console.log(`Server is running on http://localhost:${PORT}`);
});
