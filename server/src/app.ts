import express from 'express'
import http from 'http'
const app = express()
import { Server } from 'socket.io'
import cors from 'cors'

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`user connected ${socket.id}`)

  socket.on('join_room', (room) => {
    socket.join(room)
  })

  socket.on('send_msg', (data) => {
    socket.to(data.room).emit('recieved_msg', { message: data.message })
  })
})

server.listen(4000, () => {
  console.log('server is running')
})
