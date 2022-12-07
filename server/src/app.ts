import express from "express";
import http from "http";
const app = express();
import { Server } from "socket.io";
import cors from "cors";
import { LooseObject } from "./types";

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userio = io.of("/user");

userio.on("connection", (socket: LooseObject) => {
  console.log("you are connect to the namespace");
  console.log(`your token is ${socket.username}`);
});

userio.use((socket: LooseObject, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUserNameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("please send token"));
  }
});

const getUserNameFromToken = (token: any) => {
  return token;
};

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("join_room", (room, cb) => {
    socket.join(room);
    cb(`joind ${room}`);
  });

  socket.on("send_msg", (data) => {
    if (!data.room) {
      socket.broadcast.emit("recieved_msg", { message: data.message });
    } else {
      socket.to(data.room).emit("recieved_msg", { message: data.message });
    }
  });
});

server.listen(4000, () => {
  console.log("server is running");
});
