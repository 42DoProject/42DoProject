import multer from "multer";
import { Request, Response } from "express";
import { IFollowUser } from "../../interface/user.interface";
import { Applyprojectprofile } from "../../models/project/applyprojectprofile.model";
import { Likeprojectprofile } from "../../models/project/likeprojectprofile.model";
import { Projectprofile } from "../../models/project/projectprofile.model";
import { Project } from "../../models/project/project.model";
import { Feed } from "../../models/user/feed.mongo";
import { Profile } from "../../models/user/profile.model";
import { User } from "../../models/user/user.model";
import { io } from "../../socket/bridge";
import * as feed from "../../module/feed";
import * as awsS3 from "../../module/aws/s3";

export const getConcurrentUsers = async (
  request: Request,
  response: Response
) => {
  const iterator = io.sockets.sockets.values();
  const users = [];
  for (var s of iterator) {
    if (s.data.user != null) {
      const u = await User.findOne({
        where: { id: s.data.user },
        include: [Profile],
      });
      users.push({
        userId: u!.id,
        username: u!.username,
        profileImage: u!.profileImage,
        statusMessage: u!.profile!.statusMessage,
      });
    }
  }
  response.status(200).send(users);
};

export const getFeed = async (request: Request, response: Response) => {
  const date = Number(request.query.date);
  const u = await Profile.findOne({ where: { userId: request.user!.id } });
  const list = [];
  if (!isNaN(date)) {
    const feed = await Feed.find({
      userId: request.user!.id,
      date: { $lt: date },
    })
      .sort({ date: -1 })
      .limit(20);
    for (const f of feed)
      list.push({ date: f.date, type: f.type, args: f.args });
    response.status(200).json(list);
    return;
  }
  const feed = await Feed.find({
    userId: request.user!.id,
    date: { $lte: u!.feed },
  })
    .sort({ date: -1 })
    .limit(10);
  const unreadFeed = await Feed.find({
    userId: request.user!.id,
    date: { $gt: u!.feed },
  });
  for (const f of unreadFeed.reverse())
    list.push({ date: f.date, type: f.type, args: f.args });
  for (const f of feed) list.push({ date: f.date, type: f.type, args: f.args });
  response.status(200).json({ unread: unreadFeed.length, list: list });
};

export const getMe = async (request: Request, response: Response) => {
  const profile = await Profile.findOne({
    include: [{ model: User, where: { id: request.user!.id } },
      { model: Projectprofile, attributes: ['id'], include: [{ model: Project }] },
      { model: Applyprojectprofile, attributes: ['id'], include: [{ model: Project }] },
      { model: Likeprojectprofile, attributes: ['id'], include: [{ model: Project }] }]
  });
  response.status(200).json({
    username: profile!.user.username,
    profileImage: profile!.user.profileImage,
    location: profile!.user.location,
    email: profile!.user.email,
    followings: profile!.following,
    following: profile!.following.length,
    follower: profile!.follower.length,
    status: profile!.status,
    position: profile!.position,
    level: profile!.level,
    skill: profile!.skill,
    lastAccess: profile!.lastAccess,
    statusMessage: profile!.statusMessage,
    introduction: profile!.introduction,
    github: profile!.github,
    participatingProject: profile!.projectprofile,
    applyingProject: profile!.applyprojectprofile,
    interestedProject: profile!.likeprojectprofile
  });
};

const arrayCondition = (array: Number[], max: Number): Number[] => {
  return array.filter(
    (item, index) => array.indexOf(item) === index && 0 <= item && item <= max
  );
};

export const modifyMe = async (request: Request, response: Response) => {
  var {
    profileImage,
    email,
    status,
    position,
    skill,
    statusMessage,
    introduction,
    github,
  } = request.body;
  try {
    if (skill) skill = arrayCondition(skill, Number(process.env.SKILL));
  } catch (e) {
    response.status(400).json({ error: "bad request" });
    return;
  }
  if (
    (status &&
      (!(0 <= Number(status) && status <= Number(process.env.STATUS)) ||
        isNaN(Number(status)))) ||
    (position &&
      (!(0 <= Number(position) && position <= Number(process.env.POSITION)) ||
        isNaN(Number(position)))) ||
    (email && typeof email === "string" && email.length > 80) ||
    (statusMessage &&
      typeof statusMessage === "string" &&
      statusMessage.length > 50) ||
    (github && typeof github === "string" && github.length > 80)
  ) {
    response.status(400).json({ error: "bad request" });
    return;
  }
  const profile = await Profile.findOne({
    include: { model: User, where: { id: request.user!.id } },
  });
  await User.update(
    {
      email: email !== undefined ? email : profile!.user.email,
      profileImage: profileImage ? profileImage : profile!.user.profileImage,
    },
    { where: { id: request.user!.id } }
  );
  await Profile.update(
    {
      status: status !== undefined ? status : profile!.status,
      position: position !== undefined ? position : profile!.position,
      skill: skill !== undefined ? skill : profile!.skill,
      statusMessage:
        statusMessage !== undefined ? statusMessage : profile!.statusMessage,
      introduction:
        introduction !== undefined ? introduction : profile!.introduction,
      github: github !== undefined ? github : profile!.github,
    },
    { where: { userId: request.user!.id } }
  );
  if (status !== undefined && status != profile!.status)
    feed.changeStatus(request.user!.id, request.user!.username, status);
  response.status(200).json({ message: "successfully updated" });
};

export const profileImage = async (request: Request, response: Response) => {
  try {
    await new Promise((resolve, reject) => {
      awsS3.profile.single("profile")(request, response, (err) => {
        if (err instanceof multer.MulterError) {
          reject(err.message);
        } else if (err) {
          reject(err.message);
        }
        resolve(null);
      });
    });
  } catch (e) {
    response.status(400).json({ error: e });
    return;
  }
  if (request.urls!.length !== 1) {
    response.status(400).json({ error: "file is not exist" });
    return;
  }
  const link = `https://${
    process.env.AWS_FILE_BUCKET_NAME
  }.s3.ap-northeast-2.amazonaws.com/${(<string[]>request.urls)[0]}`;
  await User.update(
    { profileImage: link },
    { where: { id: request.user!.id } }
  );
  response.status(200).json({ url: link });
};

export const profileMain = async (request: Request, response: Response) => {
  const { id } = request.params;
  if (!id) {
    response.status(400).json({ error: "query required do not exist" });
    return;
  }
  const profile = await Profile.findOne({
    include: [{ model: User, where: { id: id } },
      { model: Projectprofile, attributes: ['id'], include: [{ model: Project }] },
      { model: Applyprojectprofile, attributes: ['id'], include: [{ model: Project }] },
      { model: Likeprojectprofile, attributes: ['id'], include: [{ model: Project }] }]
  });
  if (!profile) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  response.status(200).json({
    username: profile.user!.username,
    profileImage: profile.user.profileImage,
    location: profile.user.location,
    email: profile.user.email,
    following: profile.following.length,
    follower: profile.follower.length,
    status: profile.status,
    position: profile.position,
    level: profile.level,
    skill: profile.skill,
    lastAccess: profile.lastAccess,
    statusMessage: profile.statusMessage,
    introduction: profile.introduction,
    github: profile.github,
    participatingProject: profile!.projectprofile,
    applyingProject: profile!.applyprojectprofile,
    interestedProject: profile!.likeprojectprofile
  });
};

export const follow = async (request: Request, response: Response) => {
  const { id } = request.params;
  if (!id) {
    response.status(400).json({ error: "query required do not exist" });
    return;
  }
  const dst = await Profile.findOne({
    include: { model: User, where: { id: id } },
  });
  if (!dst) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  if (parseInt(id) == parseInt(request.user!.id)) {
    response.status(400).json({ error: "can't follow yourself" });
    return;
  }
  const src = await Profile.findOne({
    include: { model: User, where: { id: request.user?.id } },
  });
  const following: number[] = <number[]>src!.following;
  const follower: number[] = <number[]>dst!.follower;
  if (following.includes(parseInt(id))) {
    response.status(400).json({ error: "already followed" });
    return;
  }
  following.push(parseInt(id));
  follower.push(parseInt(request.user!.id));
  await Profile.update(
    { following: following },
    { where: { userId: request.user!.id } }
  );
  await Profile.update({ follower: follower }, { where: { userId: id } });
  feed.follow(request.user!.id, request.user!.username, parseInt(id));
  response.status(200).json({ message: "successfully followed" });
};

export const unfollow = async (request: Request, response: Response) => {
  const { id } = request.params;
  if (!id) {
    response.status(400).json({ error: "query required do not exist" });
    return;
  }
  const dst = await Profile.findOne({
    include: { model: User, where: { id: id } },
  });
  if (!dst) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  if (parseInt(id) == parseInt(request.user?.id)) {
    response.status(400).json({ error: "can't unfollow yourself" });
    return;
  }
  const src = await Profile.findOne({
    include: { model: User, where: { id: request.user?.id } },
  });
  const following: number[] = <number[]>src?.following;
  const follower: number[] = <number[]>dst?.follower;
  const idx = following.indexOf(parseInt(id));
  if (idx === -1) {
    response.status(400).json({ error: "can't unfollowed" });
    return;
  }
  following.splice(idx, 1);
  follower.splice(follower.indexOf(parseInt(id)), 1);
  await Profile.update(
    { following: following },
    { where: { userId: request.user?.id } }
  );
  await Profile.update({ follower: follower }, { where: { userId: id } });
  response.status(200).json({ message: "successfully unfollowed" });
};

export const following = async (request: Request, response: Response) => {
  const { id } = request.params;
  const page = Number(request.query.page);
  if (isNaN(page) || page <= 0) {
    response.status(400).json({ error: "invalid page" });
    return;
  }
  const profile = await Profile.findOne({
    include: { model: User, where: { id: id } },
  });
  if (!profile) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  const result = profile.following.slice((page - 1) * 20, (page - 1) * 20 + 20);
  const userList: IFollowUser[] = [];
  for (const u of result) {
    const user = await User.findOne({ where: { id: u }, include: [Profile] });
    userList.push({
      userId: u,
      username: user!.username,
      profileImage: user!.profileImage,
      statusMessage: user!.profile!.statusMessage,
    });
  }
  response.status(200).json(userList);
};

export const follower = async (request: Request, response: Response) => {
  const { id } = request.params;
  const page = Number(request.query.page);
  if (isNaN(page) || page <= 0) {
    response.status(400).json({ error: "invalid page" });
    return;
  }
  const profile = await Profile.findOne({
    include: { model: User, where: { id: id } },
  });
  if (!profile) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  const result = profile.follower.slice((page - 1) * 20, (page - 1) * 20 + 20);
  const userList: IFollowUser[] = [];
  for (const u of result) {
    const user = await User.findOne({ where: { id: u }, include: [Profile] });
    userList.push({
      userId: u,
      username: user!.username,
      profileImage: user!.profileImage,
      statusMessage: user!.profile!.statusMessage,
    });
  }
  response.status(200).json(userList);
};