import { Request, Response } from "express";
import { v4 } from "uuid";
import {
  IChatMessage,
  IChatRoom,
  IChatRow,
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
  const chatSort: any[] = [];
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
    const lastChatDate = await LastChat.findOne({
      uuid: room.id,
      userId: request.user!.id,
    });
    const unreadCount = await ChatRow.count({
      uuid: room.id,
      date: { $gt: lastChatDate!.date },
    });
    const last = await ChatRow.findOne({
      uuid: room.id,
    }).sort({ date: -1 });
    chatSort.push({
      date: last ? last.date : 0,
      payload: {
        uuid: room.id,
        type: room.type,
        unread: unreadCount,
        last: last ? last.message : "",
        users: userList,
      },
    });
  }
  chatSort.sort((a, b) => b.date - a.date);
  for (const o of chatSort) chatList.push(o.payload);
  response.status(200).json(chatList);
};

const isDMExist = async (
  source: number,
  target: number
): Promise<string | null> => {
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
  if (!users || users.length === 0) {
    response.status(400).json({ error: "users length can't zero" });
    return;
  }
  var dm;
  if (
    users.length === 1 &&
    (dm = await isDMExist(request.user?.id, users[0]))
  ) {
    response.status(200).json({ uuid: dm });
    return;
  }
  const userList = [];
  var user;
  user = await User.findOne({ where: { id: request.user!.id } });
  userList.push({
    id: user!.id,
    username: user!.username,
    profileImage: user!.profileImage,
  });
  for (var u of users) {
    if (
      u == request.user?.id ||
      !(user = await User.findOne({ where: { id: u } }))
    ) {
      response.status(400).json({ error: "invalid user id included" });
      return;
    }
    userList.push({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
    });
  }
  const date = Date.now();
  const room = await Chat.create({
    id: v4(),
    type: users.length === 1 ? 0 : 1,
  });
  const register = async (uuid: string, userId: number) => {
    await ProfileChat.create({ profileId: userId, chatId: uuid });
    await new LastChat({
      uuid: uuid,
      userId: userId,
      availableDate: -1,
      date: date,
    }).save();
    getUserSocket(userId)?.join(uuid);
  };
  for (var u of users) await register(room.id, u);
  io.to(room.id).emit("chat:newRoom", {
    uuid: room.id,
    type: room.type,
    users: userList,
  });
  await register(room.id, request.user?.id);
  response.status(200).json({
    uuid: room.id,
    type: room.type,
    users: userList,
  });
};

export const getChats = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const date = Number(request.query.date);
  var lastChatDate;
  if (
    !uuid ||
    !(lastChatDate = await LastChat.findOne({
      uuid: uuid,
      userId: request.user?.id,
    }).exec()) ||
    (request.query.date && isNaN(date))
  ) {
    response.status(400).json({ error: "invalid request" });
    return;
  }
  const list: IChatMessage[] = [];
  var unreadLog: IChatRow[] = [];
  const log = await ChatRow.find({
    uuid: uuid,
    $and: [
      { date: { $lt: isNaN(date) ? lastChatDate.date + 1 : date } },
      { date: { $gt: lastChatDate.availableDate } },
    ],
  })
    .sort({ date: -1 })
    .limit(isNaN(date) ? 10 : 50);
  if (isNaN(date))
    unreadLog = await ChatRow.find({
      uuid: uuid,
      date: { $gt: lastChatDate.date },
    });
  if (unreadLog.length !== 0)
    await LastChat.updateOne(
      { uuid: uuid, userId: request.user?.id },
      { date: unreadLog[unreadLog.length - 1].date }
    );
  for (var chat of log.reverse())
    list.push({
      date: chat.date,
      userId: chat.userId,
      message: chat.message,
    });
  for (var c of unreadLog)
    list.push({
      date: c.date,
      userId: c.userId,
      message: c.message,
    });
  response.status(200).json(list);
};

export const inviteUser = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const { users } = request.body;
  var chat;
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
  const userList: IChatUser[] = [];
  const oldList = await LastChat.find({ uuid: uuid });
  var invitedUser;
  for (const u of oldList) {
    invitedUser = <User>await User.findOne({ where: { id: u.userId } });
    userList.push({
      id: invitedUser.id,
      username: invitedUser.username,
      profileImage: invitedUser.profileImage,
    });
  }
  for (const u of users) {
    if (
      u != request.user?.id &&
      !(await LastChat.findOne({
        uuid: uuid,
        userId: u,
      }).exec()) &&
      (invitedUser = await User.findOne({ where: { id: u } }))
    ) {
      userList.push({
        id: invitedUser.id,
        username: invitedUser.username,
        profileImage: invitedUser.profileImage,
      });
    }
  }
  if (userList.length === oldList.length) {
    response.status(400).json({ error: "no valid users in invite list" });
    return;
  }
  const date = Date.now();
  const register = async (chatId: string, userId: number, avdate?: number) => {
    await ProfileChat.create({ profileId: userId, chatId: chatId });
    await new LastChat({
      uuid: chatId,
      userId: userId,
      availableDate: avdate ? avdate : -1,
      date: date,
    }).save();
    getUserSocket(userId)?.join(chatId);
  };
  if ((await Chat.findOne({ where: { id: uuid } }))?.type === 0) {
    const room = await Chat.create({ id: v4(), type: 1 });
    for (const u of userList) {
      await register(room.id, u.id);
    }
    getUserSocket(request.user!.id)?.leave(room.id);
    io.to(room.id).emit("chat:newRoom", {
      uuid: room.id,
      type: 1,
      users: userList,
    });
    getUserSocket(request.user!.id)?.join(room.id);
    response.status(200).json({
      uuid: room.id,
      type: 1,
      users: userList,
    });
    return;
  }
  for (var i = oldList.length; i < userList.length; i++) {
    await new ChatRow({
      uuid: uuid,
      date: date,
      userId: -2,
      message: `${userList[i].username}님이 들어왔습니다`,
    }).save();
    io.to(uuid).emit("chat:invited", userList[i]);
    await register(uuid, userList[i].id, date);
    getUserSocket(userList[i].id)?.emit("chat:newRoom", {
      uuid: uuid,
      type: 1,
      users: userList,
    });
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
  await new ChatRow({
    uuid: uuid,
    date: Date.now(),
    userId: -1,
    message: `${request.user?.username}님이 나갔습니다`,
  }).save();
  getUserSocket(request.user?.id)?.leave(uuid);
  io.to(uuid).emit("chat:leave", { userId: request.user?.id });
  if (
    (await LastChat.count({
      uuid: uuid,
    })) === 0
  ) {
    await Chat.destroy({
      where: { id: uuid },
    });
    await ChatRow.deleteMany({
      uuid: uuid,
    });
  }
  response.status(200).json({ message: "successfully leaved" });
};
