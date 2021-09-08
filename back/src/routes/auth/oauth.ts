import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { IJwtSet, IOToken } from "../../interface/token.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../models/user/user.model";
import { BlackList } from "../../models/user/blacklist.model";

export const accessToken = async (code: string): Promise<boolean | IOToken> => {
  try {
    var res = await axios.post<IOToken>(`${process.env.FT_OAUTH}`, {
      grant_type: "authorization_code",
      client_id: process.env.FT_OAUTH_CLIENT_ID,
      client_secret: process.env.FT_OAUTH_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.FT_OAUTH_REDIRECT_URI,
    });
    return res.data;
  } catch {
    return false;
  }
};

export const refreshToken = async (
  token: string
): Promise<boolean | object> => {
  try {
    var res = await axios.post(`${process.env.FT_OAUTH}`, {
      grant_type: "refresh_token",
      client_id: process.env.FT_OAUTH_CLIENT_ID,
      client_secret: process.env.FT_OAUTH_CLIENT_SECRET,
      refresh_token: token,
    });
    return res.data;
  } catch {
    return false;
  }
};

export const tokenToUser = async (token: string): Promise<boolean | object> => {
  try {
    var res = await axios.get("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    return false;
  }
};

export const issueJwt = (uid: number): IJwtSet => {
  const now = Math.floor(Date.now() / 1000);
  const accessToken = jwt.sign({ uid: uid }, `${process.env.JWT_SECRET_KEY}`, {
    subject: "access",
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ uid: uid }, `${process.env.JWT_SECRET_KEY}`, {
    subject: "refresh",
    expiresIn: "2 days",
  });
  return {
    accessToken: accessToken,
    accessExpiry: now + 60 * 30 - 10,
    refreshToken: refreshToken,
    refreshExpiry: now + 60 * 60 * 24 * 2 - 10,
  };
};

export const jwtToObject = (
  token: string,
  options?: jwt.VerifyOptions
): string | boolean | JwtPayload => {
  var result;
  try {
    result = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, options);
  } catch {
    result = false;
  }
  return result;
};

export const authorization = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  var payload: string | boolean | JwtPayload;
  const header = request.headers.authorization;
  request.user = null;
  if (header) {
    const [, token] = header.split(" ");
    if (
      !(await BlackList.findOne({ where: { token: token } })) &&
      (payload = jwtToObject(token, { subject: "access" }))
    ) {
      request.user = await User.findOne({
        where: { id: (<JwtPayload>payload).uid },
      });
    }
  }
  next();
};

export const jwtGuards = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.user) next();
  else response.status(401).json({ error: "unauthenticated" });
};
