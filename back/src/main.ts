import express, { Request, Response } from "express";

const app: express.Application = express();

app.use("*", (request: Request, response: Response) => {
  response.json({
    idx: 1,
    message: "hello world",
  });
});

app.listen(5000, () => {
  console.log("http://localhost:5000 ~");
});
