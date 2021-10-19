import { Request, Response } from "express";
import * as search from "../../module/search";

export const searchKeyword = (request: Request, response: Response) => {
  const { keyword } = request.params;
  response.status(200).json(search.search(keyword));
};

export const getUser = (request: Request, response: Response) => {
  response.status(200).json(search.getUser());
};

export const searchUser = (request: Request, response: Response) => {
  const { keyword } = request.params;
  response.status(200).json(search.searchUser(keyword));
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
