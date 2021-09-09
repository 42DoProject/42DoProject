import express, { Request, Response } from "express";
import { List } from "../../models/project/list.model";

const app = express();
app.set('query parser', 'extended');

export const getList = async (request: Request, response: Response) => {
    let offset: number;
    let limit: number;
    let list;
    if (request.query === null)
        list = await List.findAll();
    else if (request.query.state === 'recruiting') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            list = await List.findAll({
                where: { state: 'recruiting' },
                offset: offset,
                limit: limit
            });
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            list = await List.findAll({ where: { state: 'recruiting' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else if (request.query.state === 'proceeding') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            list = await List.findAll({
                where: { state: 'proceeding' },
                offset: offset,
                limit: limit
            })
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            list = await List.findAll({ where: { state: 'proceeding' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else if (request.query.state === 'completed') {
        if (request.query.page !== undefined && request.query.pageSize !== undefined) {
            limit = Number( request.query.pageSize );
            offset = ( Number( request.query.page ) - 1 ) * limit;
            list = await List.findAll({
                where: { state: 'completed' },
                offset: offset,
                limit: limit
            })
        } else if (request.query.page === undefined && request.query.pageSize === undefined) {
            list = await List.findAll({ where: { state: 'completed' } });
        } else {
            response.status(400).json({ error: "invalid query" });
            return;
        }
    }
    else {
        response.status(400).json({ error: "invalid query" });
        return;
    }
    if (!list) {
        response.status(400).json({ error: "empty" });
        return;
    }
    response.status(200).json({ list });
}
