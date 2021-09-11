import { Request, Response } from "express";
import { Profile } from "../../models/user/profile.model";
import { User } from "../../models/user/user.model";

export const profileMain = async (request: Request, response: Response) => {
  const { id } = request.params;
  if (!id) {
    response.status(400).json({ error: "query required do not exist" });
    return;
  }
  const profile = await Profile.findOne({
    include: { model: User, where: { id: id } },
  });
  if (!profile) {
    response.status(400).json({ error: "invalid user id" });
    return;
  }
  response.status(200).json({
    username: profile.user?.username,
    level: profile.level,
    lastAccess: profile.lastAccess,
    statusMessage: profile.statusMessage,
    introduction: profile.introduction,
    history: profile.history,
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
  if (parseInt(id) == parseInt(request.user?.id)) {
    response.status(400).json({ error: "can't follow yourself" });
    return;
  }
  const src = await Profile.findOne({
    include: { model: User, where: { id: request.user?.id } },
  });
  const following: number[] = <number[]>src?.following;
  const follower: number[] = <number[]>dst?.follower;
  if (following.includes(parseInt(id))) {
    response.status(400).json({ error: "already followed" });
    return;
  }
  following.push(parseInt(id));
  follower.push(parseInt(request.user?.id));
  await Profile.update(
    { following: following },
    { where: { userId: request.user?.id } }
  );
  await Profile.update({ follower: follower }, { where: { userId: id } });
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
