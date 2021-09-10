import express, { Request, Response } from "express";
import { Project } from "../../models/project/project.model";

const app = express();
app.set('query parser', 'extended');

export const getList = async (request: Request, response: Response) => {
    let offset: number;
    let limit: number;
    let project;
    if (request.query === null)
        project = await Project.findAll();
    else if (request.query.state === 'recruiting') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            project = await Project.findAll({
                where: { state: 'recruiting' },
                offset: offset,
                limit: limit
            });
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            project = await Project.findAll({ where: { state: 'recruiting' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else if (request.query.state === 'proceeding') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            project = await Project.findAll({
                where: { state: 'proceeding' },
                offset: offset,
                limit: limit
            })
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            project = await Project.findAll({ where: { state: 'proceeding' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else if (request.query.state === 'completed') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            project = await Project.findAll({
                where: { state: 'completed' },
                offset: offset,
                limit: limit
            })
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            project = await Project.findAll({ where: { state: 'completed' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else {
        response.status(400).json({ error: "invalid query" });
        return;
    }
    if (!project) {
        response.status(400).json({ error: "empty" });
        return;
    }
    response.status(200).json({ project });
}
