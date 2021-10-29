import io from "socket.io-client";

const socket = io(`ws://${process.env.REACT_APP_DOMAIN_NAME}:5000`, {
  transports: ["websocket"],
});

socket.onAny((e) => {
  console.log(e);
});

export default socket;
