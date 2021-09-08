import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IOToken } from "../../interface/token.interface";
import { BlackList } from "../../models/user/blacklist.model";
import { OToken } from "../../models/user/otoken.model";
import { Token } from "../../models/user/token.model";
import { User } from "../../models/user/user.model";
import { accessToken, issueJwt, jwtToObject, tokenToUser } from "./oauth";

const userModelCheck = async (user: any): Promise<number> => {
  var temp;
  if ((temp = await User.findOne({ where: { intraId: user.id } })))
    return temp.id;
  const row = await User.create({
    intraId: user.id,
    username: user.login,
    name: user.displayname,
    email: user.email,
    profileImage: user.image_url,
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
  return row.id;
};

export const signIn = async (request: Request, response: Response) => {
  const { code, refresh_token } = request.query;
  if (code) {
    const token: boolean | IOToken = await accessToken(code.toString());
    if (!token) {
      response.status(401).json({ error: "invalid code" });
      return;
    }
    const user = await tokenToUser((<IOToken>token).access_token);
    if (!user) {
      response.status(400).json({ error: "42 intra is not working" });
      return;
    }
    const idx = await userModelCheck(user);
    await OToken.update(
      {
        accessToken: (<IOToken>token).access_token,
        refreshToken: (<IOToken>token).refresh_token,
        expiryDate: (<IOToken>token).created_at + (<IOToken>token).expires_in,
      },
      { where: { userId: idx } }
    );
    const jwt = issueJwt(idx);
    await Token.update(
      {
        accessToken: jwt.accessToken,
        accessExpiry: jwt.accessExpiry,
        refreshToken: jwt.refreshToken,
        refreshExpiry: jwt.refreshExpiry,
      },
      { where: { userId: idx } }
    );
    response.status(200).json(jwt);
    return;
  }
  if (refresh_token) {
    var payload;
    if (
      (await BlackList.findOne({ where: { token: refresh_token } })) ||
      !(payload = jwtToObject(refresh_token.toString(), { subject: "refresh" }))
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
      token: expiredToken?.accessToken,
      expiryDate: expiredToken?.accessExpiry,
    });
    await BlackList.create({
      token: expiredToken?.refreshToken,
      expiryDate: expiredToken?.refreshExpiry,
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
  }
  response.status(400).json({ error: "query required do not exist" });
};

export const signOut = async (request: Request, response: Response) => {
  const expiredToken = await Token.findOne({
    where: { userId: request.user?.id },
    include: {
      model: User,
      where: {
        id: request.user?.id,
      },
    },
  });
  await BlackList.create({
    token: expiredToken?.accessToken,
    expiryDate: expiredToken?.accessExpiry,
  });
  await BlackList.create({
    token: expiredToken?.refreshToken,
    expiryDate: expiredToken?.refreshExpiry,
  });
  response.status(200).json({ message: "successfully signed out" });
};
