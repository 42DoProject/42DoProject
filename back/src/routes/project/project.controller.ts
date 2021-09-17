import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import * as projectService from "./project.service";

const router: express.Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

router.get("/", (request: Request, response: Response) => {
  projectService.getList(request, response);
});

router.post("/", upload.single('img'), (request: Request, response: Response) => {
  projectService.postList(request, response);
});

router.delete("/", (request: Request, response: Response) => {
  projectService.deleteList(request, response);
});

export default router;