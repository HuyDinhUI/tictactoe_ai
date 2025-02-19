module.exports = {
  checkWin: (board) => {
    // Hàm con kiểm tra k ô liên tiếp giống nhau trong mảng
    const size = Math.sqrt(board.length);
    if (size == 3) {
      var k = 3;
    } else if (size == 4) {
      var k = 4;
    } else {
      var k = 5;
    }
    function checkLine(line) {
      let count = 0;

      for (let i = 0; i < line.length; i++) {
        if (line[i] == "X") {
          count++;

          if (count == k) {
            return "X";
          }
        } else count = 0;
      }

      if (count != k) count = 0;

      for (let i = 0; i < line.length; i++) {
        if (line[i] === "O") {
          count++;
        } else count = 0;

        if (count === k) {
          return "O";
        }
      }
      return null;
    }

    // Kiểm tra các hàng
    for (let row = 0; row < size; row++) {
      let line = [];
      for (let col = 0; col < size; col++) {
        line.push(board[row * size + col]);
      }
      if (checkLine(line)) return checkLine(line);
    }

    // Kiểm tra các cột
    for (let col = 0; col < size; col++) {
      let line = [];
      for (let row = 0; row < size; row++) {
        line.push(board[row * size + col]);
      }
      if (checkLine(line)) return checkLine(line);
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

      if (checkLine(line1) || checkLine(line2)) return checkLine(line1);
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

      if (checkLine(line1) || checkLine(line2)) return checkLine(line1);
    }

    return null;
  },
};
