import express from "express";
import auth from "./auth/auth.controller";
import user from "./user/user.controller";
import project from "./project/project.controller";
import chat from "./chat/chat.controller";
import { User } from "../models/user/user.model";
import { OToken } from "../models/user/otoken.model";
import { Token } from "../models/user/token.model";
import { Profile } from "../models/user/profile.model";
import { getIsoString } from "../module/time";

const router: express.Router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/project", project);
router.use("/chat", chat);

/* dump ! */
const makeDump = async (
  username: String,
  name: String,
  email: String,
  profileImage: String
) => {
  const row = await User.create({
    intraId: Math.floor(Math.random() * 99999),
    username: username,
    name: name,
    email: email,
    profileImage: profileImage,
  });
  await OToken.create({
    accessToken: null,
    refreshToken: null,
    expiryDate: null,
    userId: row.id,
  });
  await Token.create({
    accessToken: null,
    accessExpiry: null,
    refreshToken: null,
    refreshExpiry: null,
    userId: row.id,
  });
  await Profile.create({
    level: 0,
    lastAccess: getIsoString(),
    status: 0,
    position: 0,
    skill: [],
    statusMessage: "",
    introduction: "",
    github: null,
    following: [],
    follower: [],
    userId: row.id,
  });
  return row.id;
};

router.post("/dump", async (request, response) => {
  const { username, name, email, profileImage } = request.body;
  const res = await makeDump(username, name, email, profileImage);
  response.status(200).json({ userId: res });
});

export default router;
