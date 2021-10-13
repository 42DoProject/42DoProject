import express, { Request, Response } from "express";
// import multer from "multer";
// import path from "path";
import { jwtGuards } from "../auth/oauth";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

// const upload = multer({
//   storage: multer.diskStorage({
//     // set a localstorage destination
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     // convert a file name
//     filename: (req, file, cb) => {
//       cb(null, new Date().valueOf() + path.extname(file.originalname));
//     },
//   }),
// });

// const upload = multer({ storage: multer.memoryStorage() });

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

router.get("/content", (request: Request, response: Response) => {
  projectService.getContent(request, response);
});

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

router.get("/apply/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.getApplyerList(request, response);
});

router.post("/apply/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.applyTeam(request, response);
});

router.delete("/apply/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.cancelApply(request, response);
});

router.post("/accept/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.addMember(request, response);
});

router.delete("/accept/:projectId/:profileId", jwtGuards, (request: Request, response: Response) => {
  projectService.deleteMember(request, response);
});

router.post("/like/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.likeProject(request, response);
});

router.delete("/like/:projectId", jwtGuards, (request: Request, response: Response) => {
  projectService.unlikeProject(request, response);
});

router.get("/status", jwtGuards, (request: Request, response: Response) => {
  projectService.getStatus(request, response);
});

router.delete("/position/:projectId/:position", jwtGuards, (request: Request, response: Response) => {
  projectService.deletePosition(request, response);
})

export default router;