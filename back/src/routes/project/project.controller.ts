import express, { Request, Response } from "express";

import { jwtGuards } from "../auth/oauth";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

// project list API
router.get("/", (request: Request, response: Response) => {
  projectService.getList(request, response);
});

router.post("/", jwtGuards, (request: Request, response: Response) => {
  projectService.postList(request, response);
});

router.put("/", jwtGuards, (request: Request, response: Response) => {
  projectService.updateList(request, response);
});

router.delete("/", jwtGuards, (request: Request, response: Response) => {
  projectService.deleteList(request, response);
});

// project status regarding to user
router.get("/status", jwtGuards, (request: Request, response: Response) => {
  projectService.getStatus(request, response);
});

// project content API
router.get("/content", (request: Request, response: Response) => {
  projectService.getContent(request, response);
});

// project comments API
router.get("/comments", (request: Request, response: Response) => {
  projectService.getComments(request, response);
});

router.post("/comments", jwtGuards, (request: Request, response: Response) => {
  projectService.postComments(request, response);
});

router.put("/comments", jwtGuards, (request: Request, response: Response) => {
  projectService.updateComments(request, response);
});

router.delete("/comments", jwtGuards, (request: Request, response: Response) => {
  projectService.deleteComments(request, response);
});

// apply API
router.get("/apply/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.getApplyerList(request, response);
});

router.post("/apply/:projectId/:position", jwtGuards, (request: Request, response: Response) => {
  projectService.applyTeam(request, response);
});

router.delete("/apply/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.cancelApply(request, response);
});

// team member API
router.post("/accept/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.addMember(request, response);
});

router.delete("/accept/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.deleteMember(request, response);
});

// interest API
router.get("/interest/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.checkInterestProject(request, response);
});

router.post("/like/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.likeProject(request, response);
});

router.delete("/like/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.unlikeProject(request, response);
});

// project position API
router.put("/position/:projectId/:position", jwtGuards, (request: Request, response: Response) => {
  projectService.modifyPosition(request, response);
});

router.delete("/position/:projectId/:position", jwtGuards, (request: Request, response: Response) => {
  projectService.deletePosition(request, response);
})

// project leader API
router.put("/leader/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.changeTeamLeader(request, response);
});

export default router;