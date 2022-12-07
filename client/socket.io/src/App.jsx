import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");
const userSocket = io("http://localhost:4000/user", {
  auth: { a: "test" },
});

const App = () => {
  const [msg, setMsg] = useState("");
  const [container, setContainer] = useState([]);
  const [room, setRoom] = useState("");

  socket.on("connect", () => {
    displayMsg(`you are connected with id: ${socket.id}`);
  });

  userSocket.on("connect_error", (error) => {
    displayMsg(error.message);
  });

  const SendMsg = () => {
    socket.emit("send_msg", { message: msg, room });
  };

  const JoinRoom = () => {
    if (room != "") {
      socket.emit("join_room", room, (message) => {
        displayMsg(message);
      });
    }
  };

  const displayMsg = (msg) => {
    setContainer([...container, msg]);
  };

  socket.on("recieved_msg", (data) => {
    displayMsg(data.message);
  });

  return (
    <div className="w-full flex justify-center min-h-[100vh]">
      <div className="flex flex-col w-1/2 gap-4 mt-4">
        <div className="border-black h-[40vh] w-full overflow-auto border-2 flex flex-col gap-1">
          {container.map((item) => {
            return <h1>{item}</h1>;
          })}
        </div>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            className="border-black w-full border-2 rounded-md"
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-400 rounded-md"
            onClick={SendMsg}
          >
            Submit
          </button>
        </div>
        <div className="w-full flex gap-2">
          <input
            className="border-black border-2 w-[82%] rounded-md"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={JoinRoom}
            className="px-4 py-2 w-fit bg-blue-400 rounded-md"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
