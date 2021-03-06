import { Server, Socket } from "socket.io";

var io: Server;

export { io };

export const set = (server: Server) => {
  io = server;
};

export const getUserSocket = (u: number): Socket | null => {
  const iterator = io.sockets.sockets.values();
  for (var s of iterator) {
    if (s.data.user === u) {
      return s;
    }
  }
  return null;
};
