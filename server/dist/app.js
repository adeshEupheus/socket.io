"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on('join_room', (room) => {
        socket.join(room);
    });
    socket.on('send_msg', (data) => {
        socket.to(data.room).emit('recieved_msg', { message: data.message });
    });
});
server.listen(4000, () => {
    console.log('server is running');
});
