import { Request, Response } from "express";

const getTest = (request: Request, response: Response) => {
  response.status(200).send("Hello world ~");
};

export { getTest };
