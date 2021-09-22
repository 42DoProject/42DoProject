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
    let filteredProject;
    let projectId: number[] = [];
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ error: "missing page or pageSize query" });
        return;
    } else {
        limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
        offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;
        if (tag === undefined) {
            if (state === 'all') {
                project = await Project.findAll({
                    offset: offset,
                    limit: limit
                }).catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            } else {
                project = await Project.findAll({
                    where: { state: state },
                    offset: offset,
                    limit: limit
                }).catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            }
        } else {
            let where;
            if (state === 'all') {
                where = { id: projectId };
            } else {
                where = { state: state, id: projectId };
            }
            filteredProject = await Projecttag.findAll({
                attributes: ['projectId'],
                include: {
                    model: Tag,
                    where: { tagTitle: tag }
                }
            })
            filteredProject.forEach( async (element) => {
                if (element.projectId !== undefined) {
                    projectId.push(element.projectId);
                }
            })
            project = await Project.findAll({
                where: where,
                offset: offset,
                limit: limit
            }).catch(err => {
                response.status(400).json({ message: String(err) });
            });
        }
    }
    return project;
}

export const getList = async (request: Request, response: Response) => {
    let project;
    if (request.query.state === undefined)
        project = await pagination(request, response, 'all');
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
            projectId: project.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        .then(content => {
            Project.update({ contentId: content.id }, { where: { id: project.id }});
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

export const updateList = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { title, totalMember, currentMember, state, content } = request.body;
    await Project.update({
        title: title,
        totalMember: totalMember,
        currentMember: currentMember,
        state: state,
        updatedAt: getIsoString(),
    }, { where: { id: projectId } })
    .then(async () => {
        await Content.update({
            content: content,
            updatedAt: getIsoString()
        }, { where: { projectId: projectId }})
        .catch(err => {
            response.status(400).json({ message: String(err) });
        })
        response.status(200).json({ message: 'updated successfully.' });
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
}

export const updateTag = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { tag } = request.body;
    if (projectId === undefined) {
        response.status(400).json({ message: 'please input projectId value' });
    }
    const project = await Project.findOne({
        include: {
            model: Projecttag,
            attributes: ['tagId']
        },
        where: { id: projectId }
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
    const projectTag = project?.projecttag;
    const reqTag = await Tag.findAll({ attributes: ['id'], where: { tagTitle: tag } });
    if (projectTag !== undefined && projectTag?.length > reqTag.length) {
        let flag: number;
        projectTag.forEach( async (element1) => {
            flag = 0;
            reqTag.forEach( async (element2) => {
                if (element1.tagId === element2.id) {
                    flag = 1;
                }
            })
            if (flag === 0) {
                await Projecttag.destroy({
                    where: { tagId: element1.tagId }
                })
                .catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            }
        })
    } else if (projectTag !== undefined && projectTag?.length < reqTag.length) {
        let flag: number;
        reqTag.forEach( async (element1) => {
            flag = 0;
            projectTag.forEach( async (element2) => {
                if (element1.id === element2.tagId) {
                    flag = 1;
                }
            })
            if (flag === 0) {
                await Projecttag.create({
                    projectId: projectId,
                    tagId: element1.id
                })
                .catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            }
        })
    }
    response.status(200).json({ message: 'updated successfully.' });
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

export const postComments = async (request: Request, response: Response) => {
    const { comment, contentId, profileId } = request.body;
    await Comments.create({
        comment: comment,
        contentId: contentId,
        profileId: profileId,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .then(comment=> {
        response.status(200).json({ message: 'added successfully.', comment });
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
}

export const updateComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;
    const { comment } = request.body;
    await Comments.update({
        comment: comment,
        updatedAt: getIsoString()
    }, { where: { id: commentId } })
    .then(async () => {
        response.status(200).json({ message: 'updated successfully.' });
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
}

export const deleteComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;
    await Comments.destroy({
        where: { id: commentId }
    })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(400).json({ message: String(err) });
    });
}