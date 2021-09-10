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

/*
intra name
level
lastAccess

statusMessage
introduction


following: []
follower: []

history: [] ?
*/
