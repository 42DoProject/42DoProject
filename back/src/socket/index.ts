import { Socket, Server } from "socket.io";
import { JwtPayload } from "jsonwebtoken";
import { BlackList } from "../models/user/blacklist.model";
import { jwtToObject } from "../routes/auth/oauth";
import * as chatHandler from "./chat/chat.handler";

const jwtAuth = async (token: string): Promise<number> => {
  var payload: string | boolean | JwtPayload;
  if (
    !(await BlackList.findOne({ where: { token: token } })) &&
    (payload = jwtToObject(token, { subject: "access" }))
  ) {
    return (<JwtPayload>payload).uid;
  }
  return -1;
};

export const authorization = async (socket: Socket, next: any) => {
  socket.data.user = await jwtAuth(socket.handshake.auth.token);
  if (socket.data.user !== -1) next();
};

export const handlersFactory = (io: Server) => {
  return (socket: Socket) => {
    const handler = (
      event: string,
      callback: (io: Server, socket: Socket, payload: object) => void
    ) => {
      socket.on(event, (...payloads) => {
        callback(io, socket, payloads);
      });
    };
    socket.use(async ([event, ...args], next: (err?: Error) => void) => {
      if (args.length > 1) {
        const u = await jwtAuth(args[args.length - 1].token);
        if (socket.data.user != u) {
          socket.disconnect();
          return;
        }
        next();
      }
    });
    connect(io, socket);
    handler("disconnect", disconnect);

    /*
     * handler(@event, @function)
     *  @event: event name
     *  @function: (io: Server, socket: Socket, ...payloads): void
     */
    handler("chat:test", chatHandler.test);
  };
};

const connect = (io: Server, socket: Socket): void => {
  console.log(`connect: ${socket.id}`);
};

const disconnect = (io: Server, socket: Socket): void => {
  console.log(`disconnect: ${socket.id}`);
};
