import sequelize from "sequelize";
import express, { Request, Response } from "express";
import { Comments } from "../../models/project/comments.model";
import { Content } from "../../models/project/content.model";
import { Project } from "../../models/project/project.model";
import { Projectprofile } from "../../models/project/projectprofile.model";
import { Profile } from "../../models/user/profile.model";
import { getIsoString } from "../../module/time";

const app = express();
app.set("query parser", "extended");

const pagination = async (request: Request, response: Response, state: string) => {
    const { page, pageSize, skill, position, order } = request.query;
    let project;
    let inputOrder: string = "";

    if (order === 'view') {
        inputOrder = 'viewCount';
    } else if (order === 'like') {
        inputOrder = 'like';
    } else if (order === undefined) {
        inputOrder = 'createdAt';
    } else {
        response.status(400).json({ errMessage: "invalid order query" });
    }

    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ errMessage: "missing page or pageSize query" });
    } else {
        const limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
        const offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;

        if (skill !== undefined && position !== undefined) {
            let where;

            if (state === 'all') {
                where = sequelize.and(
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(skill))
                        ),
                        'is not null = ',
                        '1'
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(position))
                        ),
                        'is not null = ',
                        '1'
                    )
                );
            } else {
                where = sequelize.and(
                    sequelize.where(sequelize.col('state'), state),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(skill))
                        ),
                        'is not null = ',
                        '1'
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(position))
                        ),
                        'is not null = ',
                        '1'
                    )
                );
            }

            project = await Project.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'totalMember',
                    'currentMember',
                    'state',
                    'like',
                    'viewCount',
                    'commentCount',
                    'skill',
                    'position',
                    'createdAt',
                    'updatedAt'
                ],
                order: [[inputOrder, 'DESC'], ['createdAt', 'DESC']],
                where: where,
                offset: offset,
                limit: limit
            }).catch(err => {
                response.status(405).json({ errMessage: String(err) });
            });
        } else if (skill === undefined && position !== undefined) {
            let where;

            if (state === 'all') {
                where = sequelize.where(
                    sequelize.fn(
                        'JSON_SEARCH',
                        sequelize.col('position'),
                        sequelize.literal(JSON.stringify('one')),
                        sequelize.literal(JSON.stringify(position))
                    ),
                    'is not null = ',
                    '1'
                );
            } else {
                where = sequelize.and(sequelize.where(sequelize.col('state'), state),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(position))
                        ),
                        'is not null = ',
                        '1'
                    ));
            }

            project = await Project.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'totalMember',
                    'currentMember',
                    'state',
                    'like',
                    'viewCount',
                    'commentCount',
                    'skill',
                    'position',
                    'createdAt',
                    'updatedAt'
                ],
                order: [[inputOrder, 'DESC'], ['createdAt', 'DESC']],
                where: where,
                offset: offset,
                limit: limit
            }).catch(err => {
                response.status(405).json({ errMessage: String(err) });
            });
        } else if (skill !== undefined && position === undefined) {
            let where;

            if (state === 'all') {
                where = sequelize.where(
                    sequelize.fn(
                        'JSON_SEARCH',
                        sequelize.col('skill'),
                        sequelize.literal(JSON.stringify('one')),
                        sequelize.literal(JSON.stringify(skill))
                    ),
                    'is not null = ',
                    '1'
                );
            } else {
                where = sequelize.and(sequelize.where(sequelize.col('state'), state),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_SEARCH',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify('one')),
                            sequelize.literal(JSON.stringify(skill))
                        ),
                        'is not null = ',
                        '1'
                    ));
            }

            project = await Project.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'totalMember',
                    'currentMember',
                    'state',
                    'like',
                    'viewCount',
                    'commentCount',
                    'skill',
                    'position',
                    'createdAt',
                    'updatedAt'
                ],
                order: [[inputOrder, 'DESC'], ['createdAt', 'DESC']],
                where: where,
                offset: offset,
                limit: limit
            }).catch(err => {
                response.status(405).json({ errMessage: String(err) });
            });
        } else {
            let where;

            if (state == 'all') {
                where = {};
            } else {
                where = { state: state };
            }

            project = await Project.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'totalMember',
                    'currentMember',
                    'state',
                    'like',
                    'viewCount',
                    'commentCount',
                    'skill',
                    'position',
                    'createdAt',
                    'updatedAt'
                ],
                order: [[inputOrder, 'DESC'], ['createdAt', 'DESC']],
                where: where,
                offset: offset,
                limit: limit
            }).catch(err => {
                response.status(405).json({ errMessage: String(err) });
            });
        }
    }
    return project;
}

export const getList = async (request: Request, response: Response) => {
    let project;

    if (request.query.state === undefined) {
        project = await pagination(request, response, 'all');
    }
    else if (request.query.state === 'recruiting' || request.query.state === 'proceeding'
        || request.query.state === 'completed') {
        project = await pagination(request, response, request.query.state);
    } else {
        response.status(400).json({ errMessage: 'invalid state query' });
    }

    response.status(200).json({ project });
}

const arrayCondition = (array: Number[], max: Number): Number[] => {
    return array.filter(
        (item, index) => array.indexOf(item) === index && 0 <= item && item <= max
    );
};

export const postList = async (request: Request, response: Response) => {
    const { title, totalMember, currentMember, state, startDate, endDate, content } = request.body;
    let { skill, position } = request.body;
    let inputState: string = (totalMember - currentMember > 0) ? 'recruiting' : 'proceeding';
    
    if (state !== undefined)
        inputState = state;

    try {
        if (skill) skill = arrayCondition(skill, Number(process.env.SKILL));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid skill query' });
        return;
    }
    try {
        if (position) position = arrayCondition(position, Number(process.env.POSITION));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid position query' });
        return;
    }

    await Project.create({
    	title: title,
        // fileName: (request.file === undefined ? null : request.file.filename),
        // filePath: (request.file === undefined ? null : request.file.path),
        totalMember: totalMember,
        currentMember: currentMember,
        state: inputState,
        startDate: startDate,
        endDate: endDate,
        like: 0,
        viewCount: 0,
        commentCount: 0,
        skill: skill,
        position: position,
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
            Project.update({ contentId: content.id }, { where: { id: project.id }})
            .catch(err => {
                response.status(405).json({ errMessage: String(err) });
            });
        }).catch(err => {
            response.status(405).json({ errMessage: String(err) });
        });

        response.status(200).json({ message: 'added successfully.' });
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
}

export const updateList = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { title, totalMember, currentMember, state, startDate, endDate, content } = request.body;
    let { skill, position } = request.body;
    let inputState: string = (totalMember - currentMember > 0) ? 'recruiting' : 'proceeding';

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
    }
    if (state !== undefined)
        inputState = state;

    try {
        if (skill) skill = arrayCondition(skill, Number(process.env.SKILL));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid skill query' });
        return;
    }
    try {
        if (position) position = arrayCondition(position, Number(process.env.POSITION));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid position query' });
        return;
    }

    await Project.update({
        title: title,
        totalMember: totalMember,
        currentMember: currentMember,
        state: inputState,
        startDate: startDate,
        endDate: endDate,
        skill: skill,
        position: position,
        updatedAt: getIsoString(),
    }, { where: { id: projectId } })
    .then(async () => {
        await Content.update({
            content: content,
            updatedAt: getIsoString()
        }, { where: { projectId: projectId }})
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        })

        response.status(200).json({ message: 'updated successfully.' });
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
}

export const deleteList = async (request: Request, response: Response) => {
    const { projectId } = request.query;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
    }

    await Content.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Project.destroy({
        where: { id: projectId }
    })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const getContent = async (request: Request, response: Response) => {
    const { projectId } = request.query;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
    }

    await Project.findOne({
        attributes: ['viewCount'],
        where: { id: projectId }
    })
    .then(async project => {
        let curViews = project?.viewCount;
        let newViews: number = Number(curViews) + 1;
        await Project.update({
            viewCount: newViews
        }, { where: { id: projectId } });
    });

    await Project.findOne({
        attributes: [
            'id',
            'title',
            'totalMember',
            'currentMember',
            'state',
            'startDate',
            'endDate',
            'like',
            'viewCount',
            'commentCount',
            'skill',
            'position'
        ],
        include: [{
            model: Content,
            attributes: ['id', 'content', 'createdAt', 'updatedAt']
        }, {
            model: Projectprofile,
            attributes: ['id'],
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
        response.status(405).json({ errMessage: String(err) });
    });
}

export const getComments = async (request: Request, response: Response) => {
    const { projectId, page, pageSize } = request.query;
    let limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
    let offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
    }
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ errMessage: "missing page or pageSize query" });
    }

    await Comments.findAndCountAll({
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{
            model: Content,
            attributes: ['id'],
            where: { projectId: projectId },
            required: true
        }, {
            model: Profile
        }],
        order: ['createdAt'],
        offset: offset,
        limit: limit
    })
    .then(comments => {
        response.status(200).json({ comments });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const postComments = async (request: Request, response: Response) => {
    const { comment, contentId, profileId } = request.body;

    await Project.findOne({
        attributes: ['commentCount'],
        where: { contentId: contentId }
    })
    .then(async project => {
        const newCount: number = (project?.commentCount === undefined)? 0 : project?.commentCount + 1;
        await Project.update({
            commentCount: newCount
        }, { where: { contentId: contentId } })
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })

    await Comments.create({
        comment: comment,
        contentId: contentId,
        profileId: profileId,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .then(() => {
        response.status(200).json({ message: 'added successfully.' });
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
}

export const updateComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;
    const { comment } = request.body;

    if (commentId === undefined) {
        response.status(400).json({ errMessage: 'please input commentId value' });
    }

    await Comments.update({
        comment: comment,
        updatedAt: getIsoString()
    }, { where: { id: commentId } })
    .then(async () => {
        response.status(200).json({ message: 'updated successfully.' });
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
}

export const deleteComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;

    if (commentId === undefined) {
        response.status(400).json({ errMessage: 'please input commentId value' });
    }

    await Comments.findOne({
        attributes: ['contentId'],
        where: { id: commentId }
    })
    .then(async content => {
        const contentId = content?.contentId;
        await Project.findOne({
            attributes: ['commentCount'],
            where: { contentId: contentId }
        })
        .then(async project => {
            const newCount: number = (project?.commentCount === undefined)? 0 : project?.commentCount - 1;
            await Project.update({
                commentCount: newCount
            }, { where: { contentId: contentId } })
        })
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        })
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    })

    await Comments.destroy({
        where: { id: commentId }
    })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}