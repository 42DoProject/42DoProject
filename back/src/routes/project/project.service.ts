import sequelize from "sequelize";
import express, { Request, Response } from "express";
import { Applyprojectprofile } from "../../models/project/applyprojectprofile.model";
import { Comments } from "../../models/project/comments.model";
import { Content } from "../../models/project/content.model";
import { Likeprojectprofile } from "../../models/project/likeprojectprofile.model";
import { Project } from "../../models/project/project.model";
import { Projectprofile } from "../../models/project/projectprofile.model";
import { Profile } from "../../models/user/profile.model";
import { User } from "../../models/user/user.model";
import { getIsoString } from "../../module/time";

const app = express();
app.set("query parser", "extended");

const getFiltedData = async (inputOrder: string, limit: number | undefined,
    offset: number | undefined, where: {} | sequelize.AndOperator<any> | sequelize.Utils.Where,
    response: Response) => {
    const project = await Project.findAndCountAll({
        attributes: [
            'id',
            'title',
            'leader',
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
        return -1;
    })
    return project;
}

const paginationAndOrdering = async (request: Request, response: Response, state: string) => {
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
        let where;

        if (skill !== undefined && position !== undefined) {
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
        } else if (skill === undefined && position !== undefined) {
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
        } else if (skill !== undefined && position === undefined) {
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
        } else {
            if (state == 'all') {
                where = {};
            } else {
                where = { state: state };
            }
        }
        project = await getFiltedData(inputOrder, limit, offset, where, response);
        if (project === -1) {
            return -1;
        }
    }
    return project;
}

export const getList = async (request: Request, response: Response) => {
    let project;

    if (request.query.state === undefined) {
        project = await paginationAndOrdering(request, response, 'all');
    }
    else if (request.query.state === 'recruiting' || request.query.state === 'proceeding'
        || request.query.state === 'completed') {
        project = await paginationAndOrdering(request, response, request.query.state);
    } else {
        response.status(400).json({ errMessage: 'invalid state query' });
        return ;
    }
    if (project === -1) {
        return ;
    }

    response.status(200).json({ project });
}

export const getStatus = async (request: Request, response: Response) => {
    const { projectId } = request.query;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }

    const user1 = await Profile.findOne({
        attributes: ['id'],
        include: [{
            model: Projectprofile,
            attributes: ['id'],
            where: { projectId: projectId }
        }],
        where: { id: request.user!.id }
    }).catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    const user2 = await Profile.findOne({
        attributes: ['id'],
        include: [{
            model: Applyprojectprofile,
            attributes: ['id'],
            where: { projectId: projectId }
        }],
        where: { id: request.user!.id }
    }).catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });

    if (user1?.projectprofile !== undefined) {
        response.status(200).json({ status: 'participating' });
    } else if (user2?.applyprojectprofile !== undefined) {
        response.status(200).json({ status: 'applying' });
    } else {
        response.status(200).json({ status: 'nothing' });
    }
}

const arrayCondition = (array: Number[], max: Number): Number[] => {
    return array.filter(
        (item, index) => array.indexOf(item) === index && 0 <= item && item <= max
    );
};

export const postList = async (request: Request, response: Response) => {
    const { title, totalMember, state, startDate, endDate, content } = request.body;
    let { skill, position } = request.body;
    let inputState: string = (totalMember > 1) ? 'recruiting' : 'proceeding';
    
    if (state !== undefined) {
        inputState = state;
    }

    try {
        if (skill) skill = arrayCondition(skill, Number(process.env.SKILL));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid skill query' });
        return ;
    }
    try {
        if (position) position = arrayCondition(position, Number(process.env.POSITION));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid position query' });
        return ;
    }

    const project = await Project.create({
    	title: title,
        // fileName: (request.file === undefined ? null : request.file.filename),
        // filePath: (request.file === undefined ? null : request.file.path),
        leader: request.user?.id,
        totalMember: totalMember,
        currentMember: 1,
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
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    await Projectprofile.create({
        projectId: project!.id,
        profileId: request.user?.id,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    const newContent = await Content.create({
        content: content,
        projectId: project!.id,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    Project.update({ contentId: newContent!.id }, { where: { id: project!.id }})
    .then(() => {
        response.status(200).json({ message: 'added successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const updateList = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    const { title, totalMember, currentMember, state, startDate, endDate, content } = request.body;
    let { skill, position } = request.body;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }
    
    const project = await Project.findOne({
        attributes: ['leader', 'currentMember'],
        where: { id: projectId }
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    if (project!.leader !== request.user!.id) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }
    if (totalMember < project!.currentMember) {
        response.status(400).json({ errMessage: 'invalid totalMember' });
        return ;
    }
    let inputState: string = (totalMember - currentMember > 0) ? 'recruiting' : 'proceeding';
    if (state !== undefined) {
        inputState = state;
    }

    try {
        if (skill) skill = arrayCondition(skill, Number(process.env.SKILL));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid skill query' });
        return ;
    }
    try {
        if (position) position = arrayCondition(position, Number(process.env.POSITION));
    } catch (e) {
        response.status(400).json({ errMessage: 'invalid position query' });
        return ;
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
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    await Content.update({
        content: content,
        updatedAt: getIsoString()
    }, { where: { projectId: projectId }})
    .then(() => {
        response.status(200).json({ message: 'updated successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const deleteList = async (request: Request, response: Response) => {
    const { projectId } = request.query;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }
    const project = await Project.findOne({
        attributes: ['leader'],
        where: { id: projectId }
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    if (project!.leader !== request.user!.id) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }
    const content = await Content.findOne({
        attributes: ['id'],
        where: { projectId: projectId }
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })

    await Comments.destroy({
        where: { contentId: content!.id }
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    await Content.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Applyprojectprofile.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Likeprojectprofile.destroy({
        where: { projectId: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Projectprofile.destroy({
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
        return ;
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
        }, { where: { id: projectId } })
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        });
    });

    await Project.findOne({
        attributes: [
            'id',
            'title',
            'leader',
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
                model: Profile,
                include: [{
                    model: User,
                    attributes: ['profileImage']
                }]
            }],
            separate: true
        }],
        where: { id: projectId }
    })
    .then(content => {
        response.status(200).json({ 'connectProfileId': request.user!.id, 'content': content });
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
        return ;
    }
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ errMessage: "missing page or pageSize query" });
        return ;
    }

    await Comments.findAndCountAll({
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{
            model: Content,
            attributes: ['id'],
            where: { projectId: projectId },
            required: true
        }, {
            model: Profile,
            include: [{
                model: User,
                attributes: ['username']
            }]
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
    const { contentId } = request.query;
    const { comment } = request.body;

    if (contentId === undefined) {
        response.status(400).json({ errMessage: 'please input contentId value' });
        return ;
    }

    await Project.findOne({
        attributes: ['commentCount'],
        where: { contentId: contentId }
    })
    .then(async project => {
        const newCount: number = (project?.commentCount === undefined) ? 0 : project?.commentCount + 1;
        await Project.update({
            commentCount: newCount
        }, { where: { contentId: contentId } })
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        })
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })

    await Comments.create({
        comment: comment,
        contentId: contentId,
        profileId: request.user!.id,
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
        return ;
    }
    const checkAuthority = await Comments.findOne({
        attributes: ['profileId'],
        where: { id: commentId }
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    if (checkAuthority!.profileId !== request.user!.id) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
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
        return ;
    }

    const comment = await Comments.findOne({
        attributes: ['contentId', 'profileId'],
        where: { id: commentId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    })
    if (comment!.profileId !== request.user!.id) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }
    const contentId = comment?.contentId;
    await Project.findOne({
        attributes: ['commentCount'],
        where: { contentId: contentId }
    })
    .then(async project => {
        const newCount: number = (project?.commentCount === undefined)? 0 : project?.commentCount - 1;
        await Project.update({
            commentCount: newCount
        }, { where: { contentId: contentId } })
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

export const getApplyerList = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }
    const project = await Project.findOne({
        attributes: ['id', 'leader'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!project) {
        response.status(400).json({ errMessage: 'invalid projectId param' });
        return ;
    }
    if (project!.leader !== request.user!.id) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }

    await Applyprojectprofile.findAndCountAll({
        attributes: ['projectId', 'position'],
        include: {
            model: Profile,
            include: [{
                model: User,
                attributes: ['username', 'profileImage']
            }]
        },
        where: { projectId: projectId }
    })
    .then(applyerList => {
        if (applyerList.count === 0) {
            response.status(200).json({ message: 'empty applyerList' });
        } else {
            response.status(200).json({ applyerList });
        }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const applyTeam = async (request: Request, response: Response) => {
    const { projectId, position } = request.params;

    if (projectId === undefined && position === undefined) {
        response.status(400).json({ errMessage: 'please input projectId and position value' });
        return ;
    }
    const project = await Project.findOne({
        attributes: ['id'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!project) {
        response.status(400).json({ errMessage: 'invalid projectId param' });
        return ;
    }
    const profile = await Profile.findOne({
        attributes: ['id'],
        where: { id: request.user!.id }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!profile) {
        response.status(400).json({ errMessage: 'invalid profileId param' });
        return ;
    }

    await Applyprojectprofile.create({
        position: position,
        projectId: projectId,
        profileId: request.user!.id,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .then(() => {
        response.status(200).json({ message: 'applyed successfully.' });
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
}

export const cancelApply = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;

    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }
    const applyprojectprofile = await Applyprojectprofile.findOne({
        attributes: ['id'],
        include: {
            model: Project,
            attributes: ['leader']
        },
        where: { projectId: projectId, profileId: profileId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!applyprojectprofile) {
        response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
        return ;
    }
    if (request.user!.id != profileId && request.user!.id !== applyprojectprofile?.project.leader) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }

    await Applyprojectprofile.destroy({
        where: { projectId: projectId, profileId: profileId }
    })
    .then(() => {
        response.status(200).json({ message: 'canceled successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const addMember = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;

    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }
    const applyprojectprofile = await Applyprojectprofile.findOne({
        attributes: ['id', 'position'],
        include: {
            model: Project,
            attributes: ['leader']
        },
        where: { projectId: projectId, profileId: profileId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!applyprojectprofile) {
        response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
        return ;
    }
    if (request.user!.id !== applyprojectprofile?.project.leader) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }

    const project = await Project.findOne({
        attributes: ['totalMember', 'currentMember', 'position'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    const curMembers = project?.currentMember;
    const newMembers: number = Number(curMembers) + 1;
    if (newMembers > project!.totalMember) {
        response.status(400).json({ errMessage: 'please expand totalMember' });
        return ;
    }
    let curPosition = project!.position;
    curPosition.splice(curPosition.indexOf(applyprojectprofile!.position), 1);
    const inputState: string = (project!.totalMember - newMembers > 0) ? 'recruiting' : 'proceeding';
    await Project.update({
        currentMember: newMembers,
        state: inputState,
        position: curPosition
    }, { where: { id: projectId } })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Projectprofile.create({
        projectId: projectId,
        profileId: profileId,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })

    await Applyprojectprofile.destroy({
        where: { projectId: projectId, profileId: profileId }
    })
    .then(() => {
        response.status(200).json({ message: 'added successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const deleteMember = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;

    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }
    const projectprofile = await Projectprofile.findOne({
        attributes: ['id'],
        include: {
            model: Project,
            attributes: ['leader']
        },
        where: { projectId: projectId, profileId: profileId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!projectprofile) {
        response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
        return ;
    }
    if (request.user!.id !== projectprofile?.project.leader) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }

    const project = await Project.findOne({
        attributes: ['totalMember', 'currentMember'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    let curMembers = project?.currentMember;
    let newMembers: number = Number(curMembers) - 1;
    await Project.update({
        currentMember: newMembers,
        state: 'recruiting'
    }, { where: { id: projectId } })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Projectprofile.destroy({
        where: { projectId: projectId, profileId: profileId }
    })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const likeProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }
    const project = await Project.findOne({
        attributes: ['id'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (!project) {
        response.status(400).json({ errMessage: 'invalid projectId param' });
        return ;
    }

    await Likeprojectprofile.create({
        projectId: projectId,
        profileId: request.user!.id,
        createdAt: getIsoString(),
        updatedAt: getIsoString()
    })
    .catch(err => {
    	response.status(405).json({ errMessage: String(err) });
    })
    await Project.findOne({
        attributes: ['like'],
        where: { id: projectId }
    })
    .then(async project => {
        let curLikes = project?.like;
        let newLikes: number = Number(curLikes) + 1;
        await Project.update({
            like: newLikes
        }, { where: { id: projectId } })
        .then(() => {
            response.status(200).json({ message: 'liked successfully.' });
        })
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        });
    });
}

export const unlikeProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    await Likeprojectprofile.destroy({
        where: { projectId: projectId, profileId: request.user!.id }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    await Project.findOne({
        attributes: ['like'],
        where: { id: projectId }
    })
    .then(async project => {
        let curLikes = project?.like;
        let newLikes: number = Number(curLikes) - 1;
        await Project.update({
            like: newLikes
        }, { where: { id: projectId } })
        .then(() => {
            response.status(200).json({ message: 'unliked successfully.' });
        })
        .catch(err => {
            response.status(405).json({ errMessage: String(err) });
        });
    });
}

export const deletePosition = async (request: Request, response: Response) => {
    const { projectId, position } = request.params;

    if (projectId === undefined || position === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or position value' });
        return ;
    }

    const project = await Project.findOne({
        attributes: ['position', 'leader'],
        where: { id: projectId }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (request.user!.id !== project?.leader) {
        response.status(401).json({ errMessage: 'no authority' });
        return ;
    }
    
    let curPosition = project!.position;
    if (curPosition === null) {
        response.status(400).json({ errMessage: 'empty position' });
    }
    curPosition.splice(curPosition.indexOf(parseInt(position)), 1);
    await Project.update({
        position: curPosition
    }, { where: { id: projectId } })
    .then(() => {
        response.status(200).json({ message: 'deleted successfully.' });
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
}

export const checkInterestProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    const likeprojectprofile = await Likeprojectprofile.findOne({
        where: { projectId: projectId, profileId: request.user!.id }
    })
    .catch(err => {
        response.status(405).json({ errMessage: String(err) });
    });
    if (likeprojectprofile === null) {
        response.status(200).json({ message: 'false' });
    } else {
        response.status(200).json({ message: 'true' });
    }
}