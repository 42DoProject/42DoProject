import { NextFunction, Request, Response } from "express";

export const authorization = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(request.user);
  next();
};

export const signIn = async (request: Request, response: Response) => {
  const { code, refresh_token } = request.query;
  console.log(Math.ceil(Date.now() / 1000));
  if (code) {
    return;
  }
  if (refresh_token) {
    /*
    should be treated as jwt, not oauth: oauth must not be exposed
    */
  }
  response.status(200).send("a");
};
