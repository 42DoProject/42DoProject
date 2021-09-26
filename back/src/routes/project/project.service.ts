import express, { Request, Response } from "express";
import { getIsoString } from "../../module/time";
import { Project } from "../../models/project/project.model";
import { Tag } from "../../models/project/tag.model";
import { Position } from "../../models/project/position.model";
import { Projecttag } from "../../models/project/projecttag.model";
import { Projectposition } from "../../models/project/projectposition.model";
import { Content } from "../../models/project/content.model";
import { Projectprofile } from "../../models/project/projectprofile.model";
import { Comments } from "../../models/project/comments.model";
import { Profile } from "../../models/user/profile.model";

const app = express();
app.set("query parser", "extended");

const pagination = async (request: Request, response: Response, state: string) => {
    const { page, pageSize, tag } = request.query;
    let project;
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ error: "missing page or pageSize query" });
        return;
    } else {
        const limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
        const offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;
        if (tag === undefined) {
            if (state === 'all') {
                project = await Project.findAll({
                    attributes: ['id', 'title', 'totalMember', 'currentMember', 'state', 'like', 'createdAt', 'updatedAt'],
                    include: {
                        model: Projecttag,
                        attributes: ['id'],
                        include: [{ model: Tag, attributes: ['tagTitle']}]
                    },
                    offset: offset,
                    limit: limit
                }).catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            } else {
                project = await Project.findAll({
                    attributes: ['id', 'title', 'totalMember', 'currentMember', 'state', 'like', 'createdAt', 'updatedAt'],
                    include: {
                        model: Projecttag,
                        attributes: ['id'],
                        include: [{ model: Tag, attributes: ['tagTitle']}]
                    },
                    where: { state: state },
                    offset: offset,
                    limit: limit
                }).catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            }
        } else {
            let where;
            let projectId: number[] = [];
            if (state === 'all') {
                where = { id: projectId };
            } else {
                where = { state: state, id: projectId };
            }
            const filteredProject = await Projecttag.findAll({
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
                attributes: ['id', 'title', 'totalMember', 'currentMember', 'state', 'like', 'createdAt', 'updatedAt'],
                include: {
                    model: Projecttag,
                    attributes: ['id'],
                    include: [{ model: Tag, attributes: ['tagTitle'] }]
                },
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
    const { title, totalMember, currentMember, startDate, endDate, tag, position, content } = request.body;
    // const date = new Date();
    let tagTable;
    let positionTable;
    // let splitDate: string[] = endDate.split('-');
    let state: string = (totalMember - currentMember > 0) ? 'recruiting' : 'proceeding';
    // if (Number(splitDate[0]) < Number(date.getFullYear())) {
    //     state = 'completed';
    // } else if (Number(splitDate[0]) === Number(date.getFullYear())) {
    //     if (Number(splitDate[1]) < (Number(date.getMonth()) + 1)) {
    //         state = 'completed';
    //     } else if (Number(splitDate[1]) === (Number(date.getMonth()) + 1)) {
    //         if (Number(splitDate[2]) < Number(date.getDate())) {
    //             state = 'completed';
    //     }
    // }
    await Project.create({
    	title: title,
        // fileName: (request.file === undefined ? null : request.file.filename),
        // filePath: (request.file === undefined ? null : request.file.path),
        totalMember: totalMember,
        currentMember: currentMember,
        state: state,
        startDate: startDate,
        endDate: endDate,
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
        }
        if (position !== undefined) {
            positionTable = await Position.findAll({ attributes: ['id'], where: { positionName: position } });
            positionTable.forEach( async (element) => {
                await Projectposition.create({
                    projectId: project.id,
                    positionId: element.id
                })
            })
        }
        response.status(200).json({ message: 'added successfully.', project });
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
}

export const updateList = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { title, totalMember, currentMember, startDate, endDate, content } = request.body;
    let state: string = (totalMember - currentMember > 0) ? 'recruiting' : 'proceeding';
    await Project.update({
        title: title,
        totalMember: totalMember,
        currentMember: currentMember,
        state: state,
        startDate: startDate,
        endDate: endDate,
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

export const updatePosition = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { position } = request.body;
    if (projectId === undefined) {
        response.status(400).json({ message: 'please input projectId value' });
    }
    const project = await Project.findOne({
        include: {
            model: Projectposition,
            attributes: ['positionId']
        },
        where: { id: projectId }
    })
    .catch(err => {
    	response.status(400).json({ message: String(err) });
    })
    const projectPosition = project?.projectposition;
    const reqPosition = await Position.findAll({ attributes: ['id'], where: { positionName: position } });
    if (projectPosition !== undefined && projectPosition?.length > reqPosition.length) {
        let flag: number;
        projectPosition.forEach( async (element1) => {
            flag = 0;
            reqPosition.forEach( async (element2) => {
                if (element1.positionId === element2.id) {
                    flag = 1;
                }
            })
            if (flag === 0) {
                await Projectposition.destroy({
                    where: { positionId: element1.positionId }
                })
                .catch(err => {
                    response.status(400).json({ message: String(err) });
                });
            }
        })
    } else if (projectPosition !== undefined && projectPosition?.length < reqPosition.length) {
        let flag: number;
        reqPosition.forEach( async (element1) => {
            flag = 0;
            projectPosition.forEach( async (element2) => {
                if (element1.id === element2.positionId) {
                    flag = 1;
                }
            })
            if (flag === 0) {
                await Projectposition.create({
                    projectId: projectId,
                    positionId: element1.id
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
        attributes: ['id', 'title', 'totalMember', 'currentMember', 'state', 'startDate', 'endDate', 'like'],
        include: [{
            attributes: ['id', 'content', 'createdAt', 'updatedAt'],
            model: Content
        }, {
            attributes: ['id'],
            model: Projectprofile,
            include: [{
                model: Profile
            }],
            separate: true
        }, {
            attributes: ['id'],
            model: Projectposition,
            include: [{
                model: Position
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
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{
            attributes: ['id'],
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