import { Server, Socket } from "socket.io";
import { LastChat } from "../../models/chat/lastchat.mongo";
import { ChatRow } from "../../models/chat/row.mongo";

export const send = async (io: Server, socket: Socket, payload: any) => {
  const { uuid, message } = payload[0];
  if (
    !uuid ||
    !message ||
    message.length === 0 ||
    !(await LastChat.findOne({
      uuid: uuid,
      userId: socket.data.user,
    }).exec())
  )
    return;
  const row = new ChatRow({
    uuid: uuid,
    date: Date.now(),
    userId: socket.data.user,
    message: message,
  });
  await row.save();
  io.to(uuid).emit("chat:receive", {
    uuid: uuid,
    userId: socket.data.user,
    message: message,
    date: Date.now(),
  });
};

export const readAt = async (io: Server, socket: Socket, payload: any) => {
  const { uuid } = payload[0];
  if (
    !uuid ||
    !(await LastChat.findOne({
      uuid: uuid,
      userId: socket.data.user,
    }).exec())
  )
    return;
  await LastChat.updateOne(
    { uuid: uuid, userId: socket.data.user },
    { date: Date.now() }
  );
};
