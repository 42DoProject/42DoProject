import express, { Request, Response } from "express";
import { getIsoString } from "../../module/time";
import { Project } from "../../models/project/project.model";
import { Tag } from "../../models/project/tag.model";
import { Projecttag } from "../../models/project/projecttag.model";
import { Content } from "../../models/project/content.model";
import { Projectprofile } from "../../models/project/projectprofile.model";
import { Comments } from "../../models/project/comments.model";
import { Profile } from "../../models/user/profile.model";

const app = express();
app.set("query parser", "extended");

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
        limit = (page !== undefined && pageSize !== undefined) ? undefined : Number(pageSize);
        offset = (limit === undefined) ? undefined : (Number(page) - 1) * limit;
        include = (tag === undefined) ? undefined : {
            separate: true,
            model: Projecttag,
            include: [{ model: Tag, where: { tagTitle: tag }, required: true }],
            required: true
        };
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
    const { title, totalMember, currentMember, state, tag, content } = request.body;
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
        Content.create({
            content: content,
            projectId: project.id
        })
        .then(content => {
            Project.create({ contentId: content.id });
        });
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
    const { projectId } = request.query;
    await Projecttag.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
    await Content.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
    await Project.destroy({
        where: { id: projectId }
    })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
}

export const getContent = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    if (projectId === undefined) {
        response.status(400).json({ message: 'please input projectId value' });
    }
    await Project.findOne({
        include: [{
            model: Content,
        }, {
            model: Projectprofile,
            include: [{
                model: Profile
            }],
            separate: true
        }],
        where: { id: projectId }
    })
    .then(content => {
        response.status(200).json({ content });
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
}

export const getComments = async (request: Request, response: Response) => {
    const { projectId, page, pageSize } = request.query;
    let limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
    let offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;
    if (projectId === undefined) {
        response.status(400).json({ message: 'please input projectId value' });
    }
    await Comments.findAll({
        include: [{
            model: Content,
            where: { projectId: projectId },
            required: true
        }, {
            model: Profile
        }],
        offset: offset,
        limit: limit
    })
    .then(comments => {
        response.status(200).json({ comments });
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
}