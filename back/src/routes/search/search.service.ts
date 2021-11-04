import { Request, Response } from "express";
import * as search from "../../module/search";

export const searchKeyword = (request: Request, response: Response) => {
  const { keyword } = request.params;
  response
    .status(200)
    .json(search.search(keyword, request.user ? false : true));
};

export const getUser = (request: Request, response: Response) => {
  const page = Number(request.query.page);
  if (isNaN(page) || page < 1) {
    response.status(400).json({ error: "invalid page" });
    return;
  }
  response.status(200).json(search.getUser(page, request.user ? false : true));
};

export const getUserFilter = (request: Request, response: Response) => {
  const { status, position, skill, level } = request.body;
  const page = Number(request.query.page);
  if (isNaN(page) || page < 1) {
    response.status(400).json({ error: "invalid page" });
    return;
  }
  response.status(200).json(
    search.searchUserFilter(
      {
        status: status,
        position: position,
        skill: skill,
        level: level,
      },
      page,
      request.user ? false : true
    )
  );
};

export const searchUser = (request: Request, response: Response) => {
  const { keyword } = request.params;
  response
    .status(200)
    .json(search.searchUser(keyword, request.user ? false : true));
};

export const getProject = (request: Request, response: Response) => {
  response.status(200).json(search.getProject());
};

export const searchProject = (request: Request, response: Response) => {
  const { keyword } = request.params;
  response
    .status(200)
    .json(search.searchProject(keyword.toLowerCase().split(" ")));
};
