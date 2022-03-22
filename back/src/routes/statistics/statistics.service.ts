import { Request, Response } from "express";
import { User } from "../../models/user/user.model";

export const base = async (request: Request, response: Response) => {
  response.status(200).json({
    user: await User.count(),
  });
};
