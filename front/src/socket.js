import io from "socket.io-client";

const socket = io("ws://localhost:5000", {
  transports: ["websocket"],
});

socket.onAny((e) => {
  console.log(e);
});

export default socket;
