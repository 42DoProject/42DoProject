import { Socket, Server } from "socket.io";
import { JwtPayload } from "jsonwebtoken";
import { BlackList } from "../models/user/blacklist.model";
import { jwtToObject } from "../routes/auth/oauth";
import * as chatHandler from "./chat/chat.handler";
import { getUserSocket } from "./bridge";
import { Chat } from "../models/chat/chat.model";
import { ProfileChat } from "../models/chat/profilechat.model";
import { Profile } from "../models/user/profile.model";

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

const roomManage = async (socket: Socket): Promise<void> => {
  const chats = await Chat.findAll({
    include: {
      model: ProfileChat,
      include: [{ model: Profile, where: { id: socket.data.user } }],
      required: true,
    },
  });
  for (var chat of chats) socket.join(chat.id);
};

export const handlersFactory = (io: Server) => {
  return (socket: Socket) => {
    socket.data.user = null;
    const handler = (
      event: string,
      callback: (io: Server, socket: Socket, payload: object) => void
    ) => {
      socket.on(event, (...payloads) => {
        callback(io, socket, payloads);
      });
    };
    socket.use(async ([event, ...args], next: (err?: Error) => void) => {
      if (event === "authorization") {
        const { token } = args[0];
        if (token) {
          const user = await jwtAuth(token);
          if (user !== -1) {
            const old = getUserSocket(user);
            if (old?.id !== socket.id) old?.disconnect();
            socket.data.user = user;
            await roomManage(socket);
          }
        }
        return;
      }
      if (socket.data.user !== null) next();
    });
    connect(io, socket);
    handler("disconnect", disconnect);

    /*
     * handler(@event, @function)
     *  @event: event name
     *  @function: (io: Server, socket: Socket, ...payloads): void
     */
    handler("chat:send", chatHandler.send);
    handler("chat:readAt", chatHandler.readAt);
  };
};

const connect = (io: Server, socket: Socket): void => {
  console.log(`connect: ${socket.id}`);
};

const disconnect = (io: Server, socket: Socket): void => {
  console.log(`disconnect: ${socket.id}`);
};
