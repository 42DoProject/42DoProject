import { NextFunction, Request, Response } from "express";
import { IJwtSet } from "../../interface/token.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../models/user/user.model";
import { BlackList } from "../../models/user/blacklist.model";
import { Op } from "sequelize";

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
  request.urls = [];
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

export const expiredTokenCollector = () => {
  const collector = setInterval(async () => {
    const now = Math.floor(Date.now() / 1000);
    await BlackList.destroy({
      where: {
        expiryDate: {
          [Op.lt]: now,
        },
      },
    });
  }, 1000 * 60 * 60 * 24);
};
