import express, { Request, Response } from "express";
import queryString from "qs";
// import { IOToken } from "../../interface/token.interface";
import { List } from "../../models/project/list.model";
import { Content } from "../../models/project/content.model";

const app = express();
app.set('query parser', 'extended');
