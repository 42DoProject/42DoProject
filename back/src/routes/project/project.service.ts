import express, { Request, Response } from "express";
import { Project } from "../../models/project/project.model";
import { Tag } from "../../models/project/tag.model";
import { Projecttag } from "../../models/project/projecttag.model";

const app = express();
app.set("query parser", "extended");

const pagination = async (
  request: Request,
  response: Response,
  state: string
) => {
  const { page, pageSize, tag } = request.query;
  let offset: number;
  let limit: number;
  let project;
  if (page !== undefined && pageSize !== undefined) {
    limit = Number(pageSize);
    offset = (Number(page) - 1) * limit;
    project = await Project.findAll({
      include: {
        model: Projecttag,
        include: [{ model: Tag, where: { tagTitle: tag }, required: true }],
        required: true,
      },
      where: { state: state },
      offset: offset,
      limit: limit,
    });
  } else if (page === undefined && pageSize === undefined) {
    project = await Project.findAll({
      include: {
        model: Projecttag,
        include: [{ model: Tag, where: { tagTitle: tag }, required: true }],
        required: true,
      },
      where: { state: state },
    });
  } else {
    response.status(400).json({ error: "invalid query" });
    return;
  }
  return project;
};

export const getList = async (request: Request, response: Response) => {
  let project;
  if (request.query.state === undefined) project = await Project.findAll();
  else if (request.query.state === "recruiting") {
    project = await pagination(request, response, "recruiting");
    if (!project) return;
  } else if (request.query.state === "proceeding") {
    project = await pagination(request, response, "proceeding");
    if (!project) return;
  } else if (request.query.state === "completed") {
    project = await pagination(request, response, "completed");
    if (!project) return;
  } else {
    response.status(400).json({ error: "invalid query" });
    return;
  }
  if (!project) {
    response.status(400).json({ error: "empty" });
    return;
  }
  response.status(200).json({ project });
};
