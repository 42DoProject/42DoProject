import express, { Request, Response } from "express";
import { Project } from "../../models/project/project.model";
import { Tag } from "../../models/project/tag.model";
import { Projecttag } from "../../models/project/projecttag.model";
import { getIsoString } from "../../module/time";

const app = express();
app.set('query parser', 'extended');

const pagination = async (request: Request, response: Response, state: string) => {
    const { page, pageSize, tag } = request.query;
    let offset;
    let limit;
    let project;
    let include;
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ error: "missing page or pageSize query" });
        return;
    } else {
        if (page !== undefined) {
            limit = Number(pageSize);
            offset = (Number(page) - 1) * limit;
        } else {
            limit = undefined;
            offset = undefined;
        }
        if (tag !== undefined) {
            include = {
                separate: true,
                model: Projecttag,
                include: [{ model: Tag, where: { tagTitle: tag }, required: true }],
                required: true
            };
        } else {
            include = undefined;
        }
        project = await Project.findAll({
            include: include,
            where: { state: state },
            offset: offset,
            limit: limit
        }).catch(err => {
            response.status(400).json({ message: String(err) });
        });
    }
    return project;
}

export const getList = async (request: Request, response: Response) => {
    let project;
    if (request.query.state === undefined)
        project = await Project.findAll();
    else if (request.query.state === 'recruiting' || request.query.state === 'proceeding'
        || request.query.state === 'completed') {
        project = await pagination(request, response, request.query.state);
        if (!project)
            return;
    } else {
        response.status(400).json({ error: "invalid state value" });
        return;
    }
    if (!project) {
        response.status(200).json({ error: "empty" });
        return;
    }
    response.status(200).json({ project });
}

export const postList = async (request: Request, response: Response) => {
    const { title, totalMember, currentMember, state, tag } = request.body;
    const date = new Date();
    let tagTable;
    await Project.create({
    	title: title,
        // fileName: (request.file === undefined ? null : request.file.filename),
        // filePath: (request.file === undefined ? null : request.file.path),
        totalMember: totalMember,
        currentMember: currentMember,
        state: state,
        like: 0,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .then(async project => {
        if (tag !== undefined) {
            tagTable = await Tag.findAll({ attributes: ['id'], where: { tagTitle: tag } });
            tagTable.forEach( async (element) => {
                await Projecttag.create({
                    projectId: project.id,
                    tagId: element.id
                })
            })
            response.status(200).json({ message: 'added successfully with tags.', project });
        }
        else {
            response.status(200).json({ message: 'added successfully.', project });
        }
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
}

export const deleteList = async (request: Request, response: Response) => {
    const { id } = request.query;
    await Projecttag.destroy({
        where: { projectId: id }
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
    await Project.destroy({
        where: { id: id }
    })
    .then(result => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
}