import { Socket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";
import { BlackList } from "../models/user/blacklist.model";
import { jwtToObject } from "../routes/auth/oauth";
import * as chatHandler from "./chat.handler";

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

export const handlers = (socket: Socket) => {
  const handler = (
    event: string,
    callback: (socket: Socket, payload: object) => void
  ) => {
    socket.on(event, (payload: object) => {
      callback(socket, payload);
    });
  };
  socket.use(async ([event, ...args], next: (err?: Error) => void) => {
    if (args.length == 2) {
      const u = await jwtAuth(args[1].token);
      if (socket.data.user != u) {
        socket.disconnect();
        return;
      }
      next();
    }
  });
  connect(socket);
  handler("disconnect", disconnect);

  /*
   * handler(@event, @function)
   *  @event: event name
   *  @function: (socket: Socket, payload: object): void
   */
  handler("chat:test", chatHandler.test);
};

const connect = (socket: Socket): void => {
  console.log(`connect: ${socket.id}`);
};

const disconnect = (socket: Socket): void => {
  console.log(`disconnect: ${socket.id}`);
};
