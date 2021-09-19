import { Request, Response } from "express";
import { Socket } from "socket.io";
import { v4 } from "uuid";
import {
  IChatMessage,
  IChatRoom,
  IChatUser,
} from "../../interface/chat.interface";
import { Chat } from "../../models/chat/chat.model";
import { LastChat } from "../../models/chat/lastchat.mongo";
import { ProfileChat } from "../../models/chat/profilechat.model";
import { ChatRow } from "../../models/chat/row.mongo";
import { Profile } from "../../models/user/profile.model";
import { User } from "../../models/user/user.model";
import { getUserSocket, io } from "../../socket/bridge";

export const getAllChats = async (request: Request, response: Response) => {
  const { id } = <User>request.user;
  const chatList: IChatRoom[] = [];
  const chats = await Chat.findAll({
    include: {
      model: ProfileChat,
      include: [{ model: Profile, where: { id: id } }],
      required: true,
    },
  });
  for (var room of chats) {
    const userList: IChatUser[] = [];
    const users = await User.findAll({
      include: {
        model: Profile,
        include: [{ model: ProfileChat, where: { chatId: room.id } }],
        required: true,
      },
    });
    for (var user of users) {
      userList.push({
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
      });
    }
    chatList.push({ uuid: room.id, type: room.type, users: userList });
  }
  response.status(200).json(chatList);
};

const isDMExist = async (
  source: number,
  target: number
): Promise<String | null> => {
  const chat = await Chat.findAll({
    where: { type: 0 },
    include: [
      {
        model: ProfileChat,
        include: [
          {
            model: Profile,
            where: { userId: [source, target] },
          },
        ],
      },
    ],
  });
  for (var c of chat) {
    if (c.userchat.length === 2) {
      return c.id;
    }
  }
  return null;
};

export const makeChatRoom = async (request: Request, response: Response) => {
  const { users } = request.body;
  for (var u of users) {
    if (u == request.user?.id || !(await User.findOne({ where: { id: u } }))) {
      response.status(400).json({ error: "invalid user id included" });
      return;
    }
  }
  const date = Date.now();
  if (users.length === 1) {
    const dm = await isDMExist(request.user?.id, users[0]);
    if (dm !== null) {
      response.status(200).json({ uuid: dm });
      return;
    }
    const room = await Chat.create({ id: v4(), type: 0 });
    await ProfileChat.create({ profileId: request.user?.id, chatId: room.id });
    await ProfileChat.create({ profileId: users[0], chatId: room.id });
    await new LastChat({
      uuid: room.id,
      userId: request.user?.id,
      availableDate: -1,
      date: date,
    }).save();
    await new LastChat({
      uuid: room.id,
      userId: users[0],
      availableDate: -1,
      date: date,
    }).save();
    response.status(200).json({ uuid: room.id });
    return;
  }
  const room = await Chat.create({ id: v4(), type: 1 });
  await ProfileChat.create({ profileId: request.user?.id, chatId: room.id });
  await new LastChat({
    uuid: room.id,
    userId: request.user?.id,
    availableDate: -1,
    date: date,
  }).save();
  for (var u of users) {
    await ProfileChat.create({ profileId: u, chatId: room.id });
    await new LastChat({
      uuid: room.id,
      userId: u,
      availableDate: -1,
      date: date,
    }).save();
  }
  response.status(200).json({ uuid: room.id });
};

export const getChats = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const { date } = request.query;
  var lastChatDate;
  if (
    !uuid ||
    !(lastChatDate = await LastChat.findOne({
      uuid: uuid,
      userId: request.user?.id,
    }).exec())
  ) {
    response.status(400).json({ error: "invalid request" });
    return;
  }
  if (date) {
    if (isNaN(Number(date))) {
      response.status(400).json({ error: "invalid request" });
      return;
    }
    const log = await ChatRow.find({
      uuid: uuid,
      $and: [
        { date: { $lt: Number(date) } },
        { date: { $gt: lastChatDate.availableDate } },
      ],
    })
      .sort({ date: -1 })
      .limit(50);
    const list: IChatMessage[] = [];
    for (var chat of log.reverse())
      list.push({
        date: chat.date,
        userId: chat.userId,
        message: chat.message,
      });
    response.status(200).json(list);
    return;
  }
  const log = await ChatRow.find({
    uuid: uuid,
    $and: [
      { date: { $lte: lastChatDate.date } },
      { date: { $gt: lastChatDate.availableDate } },
    ],
  })
    .sort({ date: -1 })
    .limit(10);
  const newLog = await ChatRow.find({
    uuid: uuid,
    date: { $gt: lastChatDate.date },
  });
  if (newLog.length !== 0)
    await LastChat.updateOne(
      { uuid: uuid, userId: request.user?.id },
      { date: newLog[newLog.length - 1].date }
    );
  const list: IChatMessage[] = [];
  for (var chat of log.reverse())
    list.push({
      date: chat.date,
      userId: chat.userId,
      message: chat.message,
    });
  for (var chat of newLog)
    list.push({
      date: chat.date,
      userId: chat.userId,
      message: chat.message,
    });
  response.status(200).json(list);
};

export const inviteUser = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const { users } = request.body;
  var chat;
  if (
    !uuid ||
    !(chat = await Chat.findOne({ where: { id: uuid } })) ||
    !(await LastChat.findOne({
      uuid: uuid,
      userId: request.user?.id,
    }).exec())
  ) {
    response.status(400).json({ error: "invalid request" });
    return;
  }
  for (var u of users) {
    if (
      u == request.user?.id ||
      !(await User.findOne({ where: { id: u } })) ||
      (await LastChat.findOne({
        uuid: uuid,
        userId: u,
      }).exec())
    ) {
      response.status(400).json({ error: "invalid user id included" });
      return;
    }
  }
  const date = Date.now();
  if (chat.type === 0) {
    const room = await Chat.create({ id: v4(), type: 1 });
    const userList: IChatUser[] = [];
    const currentUsers = await ProfileChat.findAll({
      where: { chatId: uuid },
      include: [Profile],
    });
    for (var cu of currentUsers) {
      getUserSocket(cu.profile.userId)?.join(room.id);
      await ProfileChat.create({
        profileId: cu.profile.userId,
        chatId: room.id,
      });
      await new LastChat({
        uuid: room.id,
        userId: cu.profile.userId,
        availableDate: -1,
        date: date,
      }).save();
      const user = await User.findOne({ where: { id: cu.profile.userId } });
      userList.push({
        id: cu.profile.userId,
        username: user?.username!,
        profileImage: user?.profileImage!,
      });
    }
    for (var u of users) {
      getUserSocket(Number(u))?.join(room.id);
      await ProfileChat.create({ profileId: u, chatId: room.id });
      await new LastChat({
        uuid: room.id,
        userId: Number(u),
        availableDate: -1,
        date: date,
      }).save();
      const user = await User.findOne({ where: { id: u } });
      userList.push({
        id: Number(u),
        username: user?.username!,
        profileImage: user?.profileImage!,
      });
    }
    io.to(room.id).emit("chat:newRoom", {
      uuid: room.id,
      type: 1,
      users: userList,
    });
    response.status(200).json({ uuid: room.id });
    return;
  }
  const userList: IChatUser[] = [];
  const currentUsers = await ProfileChat.findAll({
    where: { chatId: uuid },
    include: [Profile],
  });
  for (var cu of currentUsers) {
    const user = await User.findOne({ where: { id: cu.profile.userId } });
    userList.push({
      id: cu.profile.userId,
      username: user?.username!,
      profileImage: user?.profileImage!,
    });
  }
  for (var u of users) {
    const user = await User.findOne({ where: { id: u } });
    userList.push({
      id: Number(u),
      username: user?.username!,
      profileImage: user?.profileImage!,
    });
  }
  for (var u of users) {
    io.to(uuid).emit("chat:invited", {
      userId: u,
    });
    const uSocket = getUserSocket(Number(u));
    uSocket?.join(uuid);
    uSocket?.emit("chat:newRoom", {
      uuid: uuid,
      type: 1,
      users: userList,
    });
    await ProfileChat.create({ profileId: u, chatId: uuid });
    await new LastChat({
      uuid: uuid,
      userId: u,
      availableDate: date,
      date: date,
    }).save();
  }
  response.status(200).json({ message: "successfully invited" });
};

export const leave = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  if (
    !uuid ||
    !(await LastChat.findOne({
      uuid: uuid,
      userId: request.user?.id,
    }).exec())
  ) {
    response.status(400).json({ error: "invalid request" });
    return;
  }
  await ProfileChat.destroy({
    where: { chatId: uuid, profileId: request.user?.id },
  });
  await LastChat.deleteOne({
    uuid: uuid,
    userId: request.user?.id,
  });
  io.to(uuid).emit("chat:leave", { userId: request.user?.id });
  await new ChatRow({
    uuid: uuid,
    date: Date.now(),
    userId: -1,
    message: `${request.user?.username}님이 나갔습니다`,
  }).save();
  getUserSocket(request.user?.id)?.leave(uuid);
  const count = await LastChat.count({
    uuid: uuid,
  });
  if (count === 0) {
    await Chat.destroy({
      where: { id: uuid },
    });
    await ChatRow.deleteMany({
      uuid: uuid,
    });
  }
  response.status(200).json({ message: "successfully leaved" });
};
