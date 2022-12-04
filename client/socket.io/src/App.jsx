import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

const App = () => {
  const [msg, setMsg] = useState('')
  const [room, setRoom] = useState('')
  const [recieved, setRecieved] = useState('')

  const SendMsg = () => {
    socket.emit('send_msg', { message: msg, room })
  }

  const JoinRoom = () => {
    if (room != '') {
      socket.emit('join_room', room)
    }
  }

  useEffect(() => {
    socket.on('recieved_msg', (data) => {
      setRecieved(data.message)
    })
  }, [socket])

  return (
    <div
      style={{
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      <div
        style={{
          width: '20vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <input type='number' onChange={(e) => setRoom(e.target.value)} />
        <button onClick={JoinRoom}>Join Room</button>
        <input type='text' onChange={(e) => setMsg(e.target.value)} />
        <button type='submit' onClick={SendMsg}>
          Submit
        </button>
        {recieved}
      </div>
    </div>
  )
}

export default App
