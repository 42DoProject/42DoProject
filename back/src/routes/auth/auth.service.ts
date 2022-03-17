import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { IOToken } from "../../interface/token.interface";

import { User } from "../../models/user/user.model";
import { OToken } from "../../models/user/otoken.model";
import { Token } from "../../models/user/token.model";
import { Profile } from "../../models/user/profile.model";
import { BlackList } from "../../models/user/blacklist.model";

import { getIsoString } from "../../module/time";
import * as search from "../../module/search";
import * as awsS3 from "../../module/aws/s3";

import { issueJwt, jwtToObject } from "./oauth";
import { requestIntraAccessToken, requestIntraUser } from "./oauth/intra";
import { requestGoogleAccessToken, requestGoogleUser } from "./oauth/google";

export const makeNewAccount = async (user: any): Promise<number> => {
  const course = user.cursus_users.filter((x: any) => x.cursus_id == 21)[0];
  const row = await User.create({
    intraId: user.id,
    username: user.login,
    name: user.displayname,
    email: user.email,
    location: user.campus[0].name,
    profileImage: user.image_url,
    blurImage: "",
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
    level: course.level,
    lastAccess: getIsoString(),
    status: 0,
    position: 0,
    skill: [],
    statusMessage: "",
    introduction: "",
    github: null,
    following: [],
    follower: [],
    feed: -1,
    userId: row.id,
  });
  search.insertUser({
    id: row.id,
    username: row.username,
    profileImage: row.profileImage,
    blurImage: "",
    status: 0,
    position: 0,
    skill: [],
    level: course.level,
    statusMessage: "",
  });
  await awsS3.profileToS3(row.id, user.image_url);
  return row.id;
};

export const refreshToken = async (request: Request, response: Response) => {
  const { token } = request.query;
  var payload;

  if (!token) {
    response.status(400).json({
      error: "parameter 'token' does not exist",
    });
    return;
  }
  if (
    (await BlackList.findOne({ where: { token: token } })) ||
    !(payload = jwtToObject(token.toString(), { subject: "refresh" }))
  ) {
    response.status(401).json({ error: "invalid token" });
    return;
  }
  const jwt = issueJwt((<JwtPayload>payload).uid);
  const expiredToken = await Token.findOne({
    where: { userId: (<JwtPayload>payload).uid },
    include: {
      model: User,
      where: {
        id: (<JwtPayload>payload).uid,
      },
    },
  });
  await BlackList.create({
    token: expiredToken!.accessToken,
    expiryDate: expiredToken!.accessExpiry,
  });
  await BlackList.create({
    token: expiredToken!.refreshToken,
    expiryDate: expiredToken!.refreshExpiry,
  });
  await Token.update(
    {
      accessToken: jwt.accessToken,
      accessExpiry: jwt.accessExpiry,
      refreshToken: jwt.refreshToken,
      refreshExpiry: jwt.refreshExpiry,
    },
    { where: { userId: (<JwtPayload>payload).uid } }
  );
  response.status(200).json(jwt);
  return;
};

/* linking */

export const linkingGoogle = async (request: Request, response: Response) => {
  const { code } = request.query;
  var token: Boolean | IOToken;
  var guser: Boolean | object;

  if (!code) {
    response.status(400).json({
      error: "parameter 'code' does not exist",
    });
    return;
  }
  token = await requestGoogleAccessToken(
    code.toString(),
    process.env.GOOGLE_LINKING_REDIRECT_URI!.toString()
  );
  if (!token) {
    response.status(401).json({
      error: "invalid code",
    });
    return;
  }
  guser = await requestGoogleUser((<IOToken>token).access_token);
  if (!guser) {
    response.status(500).json({
      error: "google internal server error",
    });
    return;
  }
  await User.update(
    { googleId: (<any>guser).id, googleEmail: (<any>guser).email },
    { where: { id: request.user!.id } }
  );
  response.status(200).json({
    message: "successfully linked",
    googleEmail: (<any>guser).email,
  });
};

/* intra */

export const signInIntra = async (request: Request, response: Response) => {
  const { code } = request.query;
  var token: Boolean | IOToken;
  var user: Boolean | object;
  var userRow: User | null;
  var userId: Number;

  if (!code) {
    response.status(400).json({
      error: "parameter 'code' does not exist",
    });
    return;
  }
  token = await requestIntraAccessToken(
    code.toString(),
    process.env.INTRA_SIGNIN_REDIRECT_URI!.toString()
  );
  if (!token) {
    response.status(401).json({
      error: "invalid code",
    });
    return;
  }
  user = await requestIntraUser((<IOToken>token).access_token);
  if (!user) {
    response.status(500).json({
      error: "42 intra internal server error",
    });
    return;
  }
  userRow = await User.findOne({ where: { intraId: (<any>user).id } });
  if (!userRow) {
    if (
      (<any>user).cursus_users.filter((x: any) => x.cursus_id == 21).length == 0
    ) {
      response.status(400).json({
        error: "this service is for cadets only",
      });
      return;
    }
    userId = await makeNewAccount(user);
    userRow = await User.findOne({ where: { id: userId.toString() } });
    if (!userRow) {
      response.status(400).json({
        error: "failed user creation",
      });
      return;
    }
  }
  /* login */
  /* oauth token */
  await OToken.update(
    {
      application: 0,
      accessToken: (<IOToken>token).access_token,
      refreshToken: (<IOToken>token).refresh_token,
      expiryDate: (<IOToken>token).created_at + (<IOToken>token).expires_in,
    },
    { where: { userId: userRow.id } }
  );
  /* clean old token records */
  var expiredToken: Token | null;
  if (
    (expiredToken = await Token.findOne({ where: { userId: userRow.id } }))!
      .accessToken !== null
  ) {
    await BlackList.create({
      token: expiredToken!.accessToken,
      expiryDate: expiredToken!.accessExpiry,
    });
    await BlackList.create({
      token: expiredToken!.refreshToken,
      expiryDate: expiredToken!.refreshExpiry,
    });
  }
  /* jwt */
  const jwt = issueJwt(userRow.id);
  await Token.update(
    {
      accessToken: jwt.accessToken,
      accessExpiry: jwt.accessExpiry,
      refreshToken: jwt.refreshToken,
      refreshExpiry: jwt.refreshExpiry,
    },
    { where: { userId: userRow.id } }
  );
  response.status(200).json({
    user: {
      id: userRow.id,
      username: userRow.username,
      profileImage: userRow.profileImage,
      location: userRow.location,
      email: userRow.email,
      googleEmail: userRow.googleEmail,
    },
    token: jwt,
  });
};

/* google */
export const signInGoogle = async (request: Request, response: Response) => {
  const { code } = request.query;
  var token: Boolean | IOToken;
  var guser: Boolean | object;
  var user: User | null;

  if (!code) {
    response.status(400).json({
      error: "parameter 'code' does not exist",
    });
    return;
  }
  token = await requestGoogleAccessToken(
    code.toString(),
    process.env.GOOGLE_SIGNIN_REDIRECT_URI!.toString()
  );
  if (!token) {
    response.status(401).json({
      error: "invalid code",
    });
    return;
  }
  guser = await requestGoogleUser((<IOToken>token).access_token);
  if (!guser) {
    response.status(500).json({
      error: "google internal server error",
    });
    return;
  }
  user = await User.findOne({ where: { googleId: (<any>guser).id } });
  if (!user) {
    response.status(400).json({
      error: "can't find linked account",
    });
    return;
  }
  /* login */
  /* oauth token */
  await OToken.update(
    {
      application: 1,
      accessToken: (<IOToken>token).access_token,
      refreshToken: null,
      expiryDate: (<IOToken>token).created_at + (<IOToken>token).expires_in,
    },
    { where: { userId: user.id } }
  );
  /* clean old token records */
  var expiredToken: Token | null;
  if (
    (expiredToken = await Token.findOne({ where: { userId: user.id } }))!
      .accessToken !== null
  ) {
    await BlackList.create({
      token: expiredToken!.accessToken,
      expiryDate: expiredToken!.accessExpiry,
    });
    await BlackList.create({
      token: expiredToken!.refreshToken,
      expiryDate: expiredToken!.refreshExpiry,
    });
  }
  /* jwt */
  const jwt = issueJwt(user.id);
  await Token.update(
    {
      accessToken: jwt.accessToken,
      accessExpiry: jwt.accessExpiry,
      refreshToken: jwt.refreshToken,
      refreshExpiry: jwt.refreshExpiry,
    },
    { where: { userId: user.id } }
  );
  response.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
      location: user.location,
      email: user.email,
      googleEmail: user.googleEmail,
    },
    token: jwt,
  });
};

/* sign out */

export const signOut = async (request: Request, response: Response) => {
  const expiredToken = await Token.findOne({
    where: { userId: request.user!.id },
    include: {
      model: User,
      where: {
        id: request.user!.id,
      },
    },
  });
  await BlackList.create({
    token: expiredToken!.accessToken,
    expiryDate: expiredToken!.accessExpiry,
  });
  await BlackList.create({
    token: expiredToken!.refreshToken,
    expiryDate: expiredToken!.refreshExpiry,
  });
  await Token.update(
    {
      accessToken: null,
      accessExpiry: null,
      refreshToken: null,
      refreshExpiry: null,
    },
    { where: { userId: request.user!.id } }
  );
  response.status(200).json({ message: "successfully signed out" });
};
