import express, { Request, Response } from "express";
// import multer from "multer";
// import path from "path";
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

router.post("/", (request: Request, response: Response) => {
  projectService.postList(request, response);
});

router.put("/", (request: Request, response: Response) => {
  projectService.updateList(request, response);
});

router.delete("/", (request: Request, response: Response) => {
  projectService.deleteList(request, response);
});

router.get("/content", (request: Request, response: Response) => {
  projectService.getContent(request, response);
});

router.get("/comments", (request: Request, response: Response) => {
  projectService.getComments(request, response);
});

router.post("/comments", (request: Request, response: Response) => {
  projectService.postComments(request, response);
});

router.put("/comments", (request: Request, response: Response) => {
  projectService.updateComments(request, response);
});

router.delete("/comments", (request: Request, response: Response) => {
  projectService.deleteComments(request, response);
});

export default router;