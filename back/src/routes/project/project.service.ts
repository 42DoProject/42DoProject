import sequelize from "sequelize";
import multer from "multer";
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
import * as awsS3 from "../../module/aws/s3";
import * as feed from "../../module/feed";
import * as search from "../../module/search";

const app = express();
app.set("query parser", "extended");

export const getList = async (request: Request, response: Response) => {
    const { state, skill, position, page, pageSize, order } = request.query;
    let inputSkill, inputPosition, inputOrder, limit, offset, where;

    // ordering
    if (order === 'view')
        inputOrder = 'viewCount';
    else if (order === 'like')
        inputOrder = 'like';
    else if (order === undefined)
        inputOrder = 'createdAt';
    else {
        response.status(400).json({ errMessage: "invalid order query" });
        return ;
    }
    // pagination
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ errMessage: "missing page or pageSize query" });
        return ;
    }
    else {
        limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
        offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;
    }

    // filtering
    if (skill !== undefined && typeof skill === "object") {
        inputSkill = [];
        for (const value of Object.values(skill))
            inputSkill.push(Number(value));
        inputSkill = "[" + String(inputSkill) + "]";
    }
    else
        inputSkill = skill;
    if (position !== undefined && typeof position === "object") {
        inputPosition = [];
        for (const value of Object.values(position))
            inputPosition.push(Number(value));
        inputPosition = "[" + String(inputPosition) + "]";
    }
    else
        inputPosition = position;
    if (state === undefined) {
        if (skill === undefined) {
            if (position === undefined)
                where = {};
            else
                where = sequelize.where(
                    sequelize.fn(
                        'JSON_CONTAINS',
                        sequelize.col('position'),
                        sequelize.literal(JSON.stringify(inputPosition))
                    ),
                    sequelize.literal(String(true))
                );
        }
        else {
            if (position === undefined)
                where = sequelize.where(
                    sequelize.fn(
                        'JSON_CONTAINS',
                        sequelize.col('skill'),
                        sequelize.literal(JSON.stringify(inputSkill))
                    ),
                    sequelize.literal(String(true))
                );
            else
                where = sequelize.and(
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify(inputPosition))
                        ),
                        sequelize.literal(String(true))
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify(inputSkill))
                        ),
                        sequelize.literal(String(true))
                    )
                )
        }
    }
    else {
        if (skill === undefined) {
            if (position === undefined)
                where = { state: state };
            else
                where = sequelize.and(
                    sequelize.where(sequelize.col('state'), String(state)),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify(inputPosition))
                        ),
                        sequelize.literal(String(true))
                    )
                )
        }
        else {
            if (position === undefined)
                where = sequelize.and(
                    sequelize.where(sequelize.col('state'), String(state)),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify(inputSkill))
                        ),
                        sequelize.literal(String(true))
                    )
                )
            else
                where = sequelize.and(
                    sequelize.where(sequelize.col('state'), String(state)),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('position'),
                            sequelize.literal(JSON.stringify(inputPosition))
                        ),
                        sequelize.literal(String(true))
                    ),
                    sequelize.where(
                        sequelize.fn(
                            'JSON_CONTAINS',
                            sequelize.col('skill'),
                            sequelize.literal(JSON.stringify(inputSkill))
                        ),
                        sequelize.literal(String(true))
                    )
                )
        }
    }

    // get data
    try {
        const project = await Project.findAndCountAll({
            attributes: [
                'id',
                'title',
                'thumbnailImage',
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
        })
        response.status(200).json({ project });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

const arrayCondition = (array: Number[], max: Number): Number[] => {
    return array.filter(
        (item) => 0 <= item && item <= max
    );
};

const postThumbnail = async (request: Request, response: Response) => {
    try {
      await new Promise((resolve, reject) => {
        awsS3.project.single("thumbnail")(request, response, (err) => {
          if (err instanceof multer.MulterError) {
            reject(err.message);
          } else if (err) {
            reject(err.message);
          }
          resolve(null);
        });
      });
    } catch (e) {
      response.status(400).json({ error: e });
      return -1;
    }
    if (request.urls!.length !== 1) {
      return ;
    }
    const link = `https://${
      process.env.AWS_FILE_BUCKET_NAME
    }.s3.ap-northeast-2.amazonaws.com/${(<string[]>request.urls)[0]}`;
    return link;
  };

export const postList = async (request: Request, response: Response) => {
    // get thumbnail link and request.body
    const imageLink = await postThumbnail(request, response);
    if (imageLink === -1 || imageLink === undefined)
        return ;

    const { title, state, startDate, endDate, content, leaderPosition } = request.body;
    let { skill, position, reference } = request.body;
    if (skill !== undefined)
        skill = JSON.parse(skill);
    if (position !== undefined)
        position = JSON.parse(position);
    if (reference !== undefined)
        reference = JSON.parse(reference);

    // check valid skill and position
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
    
    // decide state
    const totalMember: number = (position === undefined) ? 1 : position.length + 1;
    let inputState: string = (totalMember > 1) ? 'recruiting' : 'proceeding';
    if (state !== undefined) {
        inputState = state;
    }

    try {
        const project = await Project.create({
            title: title,
            thumbnailImage: imageLink,
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
        const newContent = await Content.create({
            content: content,
            reference: reference,
            projectId: project!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        Project.update({ contentId: newContent!.id }, { where: { id: project!.id }})
        await Projectprofile.create({
            position: leaderPosition,
            projectId: project!.id,
            profileId: request.user?.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        // input search object
        search.insertProject({
            id: project!.id,
            image: imageLink,
            title: title
        });
        response.status(200).json({ newProject: project!.id, message: 'added successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const updateList = async (request: Request, response: Response) => {
    // get thumbnail link and request.body
    const imageLink = await postThumbnail(request, response);
    if (imageLink === -1)
        return ;

    const { projectId } = request.query;
    const { title, state, startDate, endDate, content } = request.body;
    let { skill, position, reference } = request.body;
    if (skill !== undefined)
        skill = JSON.parse(skill);
    if (position !== undefined)
        position = JSON.parse(position);
    if (reference !== undefined)
        reference = JSON.parse(reference);
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }
    
    // check valid skill and position
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

    
    try {
        const project = await Project.findOne({
            attributes: ['title', 'leader', 'currentMember', 'state'],
            where: { id: projectId }
        })
        // check authority
        if (project!.leader !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        // decide state
        const totalMember: number = (position === undefined) ? project!.currentMember : position.length + project!.currentMember;
        let inputState: string = (totalMember - project!.currentMember > 0) ? 'recruiting' : 'proceeding';
        if (state !== undefined)
            inputState = state;

        // update project data
        await Project.update({
            title: title,
            totalMember: totalMember,
            currentMember: project!.currentMember,
            state: inputState,
            startDate: startDate,
            endDate: endDate,
            skill: skill,
            position: position,
            updatedAt: getIsoString(),
        }, { where: { id: projectId } })
        await Content.update({
            content: content,
            reference: reference,
            updatedAt: getIsoString()
        }, { where: { projectId: projectId }})
        if (imageLink !== undefined) {
            await Project.update({
                thumbnailImage: imageLink
            }, { where: { id: projectId }});
            // input search object
            search.updateProject(
                { image: imageLink },
                { id: Number(projectId) }
            );
        }
        // input search object
        search.updateProject(
            { title: title },
            { id: Number(projectId) }
        );

        // feed notification when state of project is changed
        if (project!.state !== inputState) {
            const likeList = await Likeprojectprofile.findAll({
                attributes: ['profileId'],
                where: { projectId: Number(projectId) }
            })
            if (likeList !== null) {
                likeList!.forEach((element) => {
                    feed.changeProjectStatus(element.profileId, Number(projectId), project!.title, inputState);
                })
            }
        }
        response.status(200).json({ message: 'updated successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deleteList = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['leader'],
            where: { id: projectId }
        })
        const content = await Content.findOne({
            attributes: ['id'],
            where: { projectId: projectId }
        })
        // check authority
        if (project!.leader !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        // delete data
        await Applyprojectprofile.destroy({
            where: { projectId: projectId }
        });
        await Likeprojectprofile.destroy({
            where: { projectId: projectId }
        });
        await Projectprofile.destroy({
            where: { projectId: projectId }
        });
        await Comments.destroy({
            where: { contentId: content!.id }
        });
        await Content.destroy({
            where: { projectId: projectId }
        });
        await Project.destroy({
            where: { id: projectId }
        });
        response.status(200).json({ message: 'deleted successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const getStatus = async (request: Request, response: Response) => {
    const { projectId } = request.query;

    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }

    try {
        const user1 = await Profile.findOne({
            attributes: ['id'],
            include: [{
                model: Projectprofile,
                attributes: ['id'],
                where: { projectId: projectId }
            }],
            where: { id: request.user!.id }
        })
        const user2 = await Profile.findOne({
            attributes: ['id'],
            include: [{
                model: Applyprojectprofile,
                attributes: ['position'],
                where: { projectId: projectId }
            }],
            where: { id: request.user!.id }
        })

        if (user1?.projectprofile !== undefined)
            response.status(200).json({ connectProfileId: request.user!.id, status: 'participating' });
        else if (user2?.applyprojectprofile !== undefined)
            response.status(200).json({ connectProfileId: request.user!.id, applyingPosition: user2?.applyprojectprofile[0].position, status: 'applying' });
        else
            response.status(200).json({ connectProfileId: request.user!.id, status: 'nothing' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const getContent = async (request: Request, response: Response) => {
    const { projectId } = request.query;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId query' });
        return ;
    }

    try {
        // calculate viewcount
        const project = await Project.findOne({
            attributes: ['viewCount'],
            where: { id: projectId }
        })
        const curViews = project?.viewCount;
        const newViews: number = Number(curViews) + 1;
        await Project.update({
            viewCount: newViews
        }, { where: { id: projectId } })

        // get data
        const content = await Project.findOne({
            attributes: [
                'id',
                'title',
                'thumbnailImage',
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
                attributes: ['id', 'content', 'reference', 'createdAt', 'updatedAt']
            }, {
                model: Projectprofile,
                attributes: ['position'],
                include: [{
                    model: Profile,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        attributes: ['profileImage', 'username']
                    }]
                }],
                separate: true
            }],
            where: { id: projectId }
        })
        response.status(200).json({ content });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const getComments = async (request: Request, response: Response) => {
    const { projectId, page, pageSize } = request.query;
    let limit, offset;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    // pagination
    if ((page !== undefined && pageSize === undefined) ||
        (page === undefined && pageSize !== undefined)) {
        response.status(400).json({ errMessage: "missing page or pageSize query" });
        return ;
    }
    else {
        limit = (page !== undefined && pageSize !== undefined) ? Number(pageSize) : undefined;
        offset = (limit !== undefined) ? (Number(page) - 1) * limit : undefined;
    }

    try {
        // get data
        const comments = await Comments.findAndCountAll({
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
        response.status(200).json({ comments });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const postComments = async (request: Request, response: Response) => {
    const { contentId } = request.query;
    const { comment } = request.body;
    if (contentId === undefined) {
        response.status(400).json({ errMessage: 'please input contentId value' });
        return ;
    }

    try {
        // calculate commentcount
        const project = await Project.findOne({
            attributes: ['commentCount'],
            where: { contentId: contentId }
        })
        const newCount: number = (project?.commentCount === undefined) ? 0 : project?.commentCount + 1;
        await Project.update({
            commentCount: newCount
        }, { where: { contentId: contentId } })

        await Comments.create({
            comment: comment,
            contentId: contentId,
            profileId: request.user!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        response.status(200).json({ message: 'added successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const updateComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;
    const { comment } = request.body;
    if (commentId === undefined) {
        response.status(400).json({ errMessage: 'please input commentId value' });
        return ;
    }

    try {
        // check authority
        const comments = await Comments.findOne({
            attributes: ['profileId'],
            where: { id: commentId }
        })
        if (comments!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        // update data
        await Comments.update({
            comment: comment,
            updatedAt: getIsoString()
        }, { where: { id: commentId } })
        response.status(200).json({ message: 'updated successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deleteComments = async (request: Request, response: Response) => {
    const { commentId } = request.query;
    if (commentId === undefined) {
        response.status(400).json({ errMessage: 'please input commentId value' });
        return ;
    }

    try {
        const comment = await Comments.findOne({
            attributes: ['contentId', 'profileId'],
            where: { id: commentId }
        })
        // check authority
        if (comment!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        // calculate commentcount
        const contentId = comment?.contentId;
        const project = await Project.findOne({
            attributes: ['commentCount'],
            where: { contentId: contentId }
        })
        const newCount: number = (project?.commentCount === undefined)? 0 : project?.commentCount - 1;
        await Project.update({
            commentCount: newCount
        }, { where: { contentId: contentId } })

        // delete data
        await Comments.destroy({
            where: { id: commentId }
        })
        response.status(200).json({ message: 'deleted successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const getApplyerList = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['id', 'leader'],
            where: { id: projectId }
        })
        // check valid param
        if (!project) {
            response.status(400).json({ errMessage: 'invalid projectId param' });
            return ;
        }
        // check authority
        if (project!.leader !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        // get data
        const applyerList = await Applyprojectprofile.findAndCountAll({
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
        response.status(200).json({ applyerList });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const applyTeam = async (request: Request, response: Response) => {
    const { projectId, position } = request.params;
    if (projectId === undefined && position === undefined) {
        response.status(400).json({ errMessage: 'please input projectId and position value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['id', 'title', 'leader', 'position'],
            where: { id: projectId }
        })
        const profile = await Profile.findOne({
            attributes: ['id'],
            include: {
                model: User,
                attributes: ['username']
            },
            where: { id: request.user!.id }
        })
        // check valid param
        if (!project) {
            response.status(400).json({ errMessage: 'invalid projectId param' });
            return ;
        }
        if (!profile) {
            response.status(400).json({ errMessage: 'invalid profileId param' });
            return ;
        }
        // check recruitment
        if (project.position.indexOf(Number(position)) === -1) {
            response.status(400).json({ errMessage: 'not recruiting position' });
            return ;
        }

        await Applyprojectprofile.create({
            position: position,
            projectId: projectId,
            profileId: request.user!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        response.status(200).json({ message: 'applyed successfully.' });

        // feed notification
        feed.project(40, profile.id, project.id, project.title);
        feed.projectLeader(50, profile.id, profile.user.username, project.id, project.title, project.leader);
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const cancelApply = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;
    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }

    try {
        const applyprojectprofile = await Applyprojectprofile.findOne({
            attributes: ['id'],
            include: {
                model: Project,
                attributes: ['title', 'leader']
            },
            where: { projectId: projectId, profileId: profileId }
        })
        // check valid param
        if (!applyprojectprofile) {
            response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
            return ;
        }
        // check authority
        if (request.user!.id != profileId && request.user!.id !== applyprojectprofile?.project.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Applyprojectprofile.destroy({
            where: { projectId: projectId, profileId: profileId }
        })
        response.status(200).json({ message: 'canceled successfully.' });

        // feed notification
        if (request.user!.id === applyprojectprofile?.project.leader)
            feed.project(42, Number(profileId), Number(projectId), applyprojectprofile?.project.title);
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const addMember = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;
    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }

    try {
        const applyprojectprofile = await Applyprojectprofile.findOne({
            attributes: ['id', 'position'],
            include: {
                model: Project,
                attributes: ['title', 'leader']
            },
            where: { projectId: projectId, profileId: profileId }
        })
        const project = await Project.findOne({
            attributes: ['title', 'totalMember', 'currentMember', 'state', 'position'],
            where: { id: projectId }
        })
        // check valid param
        if (!applyprojectprofile) {
            response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
            return ;
        }
        // check authority
        if (request.user!.id !== applyprojectprofile?.project.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }
        // renew number of members
        const curMembers = project?.currentMember;
        const newMembers: number = Number(curMembers) + 1;
        if (newMembers > project!.totalMember) {
            response.status(400).json({ errMessage: 'please expand totalMember' });
            return ;
        }
        // renew position
        let curPosition = project!.position;
        if (curPosition.indexOf(Number(applyprojectprofile!.position)) === -1) {
            response.status(400).json({ errMessage: 'not recruiting position' });
            return ;
        }
        curPosition.splice(curPosition.indexOf(applyprojectprofile!.position), 1);
        // decide state
        const inputState: string = (project!.totalMember - newMembers > 0) ? 'recruiting' : 'proceeding';

        await Projectprofile.create({
            position: applyprojectprofile!.position,
            projectId: projectId,
            profileId: profileId,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        })
        await Applyprojectprofile.destroy({
            where: { projectId: projectId, profileId: profileId }
        })
        await Project.update({
            currentMember: newMembers,
            state: inputState,
            position: curPosition
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'added successfully.' });

        // feed notification
        feed.project(41, Number(profileId), Number(projectId), applyprojectprofile?.project.title);
        if (project!.state !== inputState) {
            const likeList = await Likeprojectprofile.findAll({
                attributes: ['profileId'],
                where: { projectId: Number(projectId) }
            })
            if (likeList !== null) {
                likeList!.forEach((element) => {
                    feed.changeProjectStatus(element.profileId, Number(projectId), project!.title, inputState);
                })
            }
        }
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deleteMember = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;
    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }

    try {
        const projectprofile = await Projectprofile.findOne({
            attributes: ['id'],
            include: {
                model: Project,
                attributes: ['leader']
            },
            where: { projectId: projectId, profileId: profileId }
        })
        const project = await Project.findOne({
            attributes: ['title', 'totalMember', 'currentMember', 'state'],
            where: { id: projectId }
        })
        // check valid param
        if (!projectprofile) {
            response.status(400).json({ errMessage: 'invalid projectId or profileId param' });
            return ;
        }
        // check authority
        if (request.user!.id !== projectprofile?.project.leader && request.user!.id !== profileId) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }
        // renew number of members
        const curMembers = project?.currentMember;
        const totalMembers = project?.totalMember;
        const newCurMembers: number = Number(curMembers) - 1;
        const newTotalMembers: number = Number(totalMembers) - 1;

        await Projectprofile.destroy({
            where: { projectId: projectId, profileId: profileId }
        })
        await Project.update({
            totalMember: newTotalMembers,
            currentMember: newCurMembers,
            state: project!.state
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'deleted successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const checkInterestProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    try {
        const likeprojectprofile = await Likeprojectprofile.findOne({
            where: { projectId: projectId, profileId: request.user!.id }
        })
        if (likeprojectprofile === null)
            response.status(200).json({ message: 'false' });
        else
            response.status(200).json({ message: 'true' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const likeProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['id', 'like'],
            where: { id: projectId }
        })
        // check valid param
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

        // renew number of likes
        let curLikes = project?.like;
        let newLikes: number = Number(curLikes) + 1;
        await Project.update({
            like: newLikes
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'liked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const unlikeProject = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    if (projectId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId value' });
        return ;
    }

    try {
        const likeprojectprofile = Likeprojectprofile.findOne({
            where: { projectId: projectId, profileId: request.user!.id }
        })
        const project = await Project.findOne({
            attributes: ['like'],
            where: { id: projectId }
        })
        // check valid param
        if (!likeprojectprofile) {
            response.status(400).json({ errMessage: 'not interested project' });
            return ;
        }

        await Likeprojectprofile.destroy({
            where: { projectId: projectId, profileId: request.user!.id }
        })

        // renew number of likes
        let curLikes = project?.like;
        let newLikes: number = Number(curLikes) - 1;
        await Project.update({
            like: newLikes
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'unliked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const modifyPosition = async (request: Request, response: Response) => {
    const { projectId, profileId, position } = request.params;
    if (projectId === undefined || projectId === undefined || position === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId or position value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['leader'],
            where: { id: projectId }
        })
        // check authority
        if (request.user!.id !== project?.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Projectprofile.update({
            position: position
        }, { where: { projectId: projectId, profileId: profileId } })
        response.status(200).json({ message: 'updated successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deletePosition = async (request: Request, response: Response) => {
    const { projectId, position } = request.params;
    if (projectId === undefined || position === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or position value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['title', 'currentMember', 'position', 'leader', 'state'],
            where: { id: projectId }
        })
        // check authority
        if (request.user!.id !== project?.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }
        // renew position
        let curPosition = project!.position;
        if (curPosition === null) {
            response.status(400).json({ errMessage: 'empty position' });
            return ;
        }
        curPosition.splice(curPosition.indexOf(parseInt(position)), 1);
        // no more position, delete applyprojectprofile data regarding to this position
        if (curPosition.indexOf(Number(position)) === -1) {
            await Applyprojectprofile.destroy({
                where: { position: position }
            })
        }
        // renew state
        const state: string = (curPosition === null) ? 'proceeding' : 'recruiting';
        const totalMember: number = curPosition.length + Number(project!.currentMember);
        await Project.update({
            totalMember: totalMember,
            state: state,
            position: curPosition
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'deleted successfully.' });

        // feed notification
        if (project!.state !== state) {
            const likeList = await Likeprojectprofile.findAll({
                attributes: ['profileId'],
                where: { projectId: Number(projectId) }
            })
            if (likeList !== null) {
                likeList!.forEach((element) => {
                    feed.changeProjectStatus(element.profileId, Number(projectId), project!.title, state);
                })
            }
        }
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const changeTeamLeader = async (request: Request, response: Response) => {
    const { projectId, profileId } = request.params;
    if (projectId === undefined || profileId === undefined) {
        response.status(400).json({ errMessage: 'please input projectId or profileId value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['leader'],
            where: { id: projectId }
        })
        // check authority
        if (request.user!.id !== project?.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Project.update({
            leader: profileId
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'changed successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const changeState = async (request: Request, response: Response) => {
    const { projectId } = request.params;
    const { state } = request.query;
    if (projectId === undefined || state == undefined) {
        response.status(400).json({ errMessage: 'please input projectId or state value' });
        return ;
    }

    try {
        const project = await Project.findOne({
            attributes: ['leader'],
            where: { id: projectId }
        })
        // check authority
        if (request.user!.id !== project?.leader) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Project.update({
            state: state
        }, { where: { id: projectId } })
        response.status(200).json({ message: 'changed successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}