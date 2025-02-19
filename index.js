const {MCTS}  = require('././AI/MCTS/mcts')

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const data_room = [];

app.get("/", (req, res) => {
  res.send("Server is running");
});

const player = {};

socketIo.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("getId", socket.id);

  socket.on("getDataRoom", function (data) {
    console.log(data);
    socketIo.emit("sendDataRoom", data);
  });

  socket.on("sendDataClient", function (data) {
    console.log(data);

    socketIo.emit("sendDataServer", data);
  });

  socket.on("AImove", function (data) {
    const bestmove = MCTS(data.newboard, data.player, data.iterations);
    socketIo.emit("Sendbestmove", bestmove);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
