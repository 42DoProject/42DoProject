import { Request, Response } from "express";

import { Likelounge } from "../../models/lounge/likelounge.model";
import { Likereply } from "../../models/lounge/likereply.model";
import { Lounge } from "../../models/lounge/lounge.model";
import { Replyoflounge } from "../../models/lounge/replyoflounge.model";
import { Profile } from "../../models/user/profile.model";
import { User } from "../../models/user/user.model";
import { getIsoString } from "../../module/time";
import * as feed from "../../module/feed";

export const getLounge = async (request: Request, response: Response) => {
    const { page, pageSize, order } = request.query;
    let inputOrder, limit, offset;

    // ordering
    if (order === 'like')
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

    try {
        const lounge = await Lounge.findAndCountAll({
            attributes: [
                'comment',
                'like',
                'replyCount',
                'createdAt',
                'updatedAt'
            ],
            include: {
                model: Profile,
                attributes: ['id'],
                include: [{
                    model: User,
                    attributes: ['profileImage', 'username']
                }]
            },
            order: [[inputOrder, 'DESC']],
            offset: offset,
            limit: limit
        })
        response.status(200).json({ lounge });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const postLounge = async (request: Request, response: Response) => {
    const { comment } = request.body;

    try {
        await Lounge.create({
            comment: comment,
            like: 0,
            replyCount: 0,
            profileId: request.user!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        });
        response.status(200).json({ message: 'added successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const updateLounge = async (request: Request, response: Response) => {
    const { loungeId } = request.params;
    const { comment } = request.body;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
        return ;
    }

    try {
        const lounge = await Lounge.findOne({
            attributes: ['profileId'],
            where: { id: loungeId }
        })
        // check authority
        if (lounge!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Lounge.update({
            comment: comment,
            updatedAt: getIsoString()
        }, { where: { id: loungeId } });
        response.status(200).json({ message: 'updated successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deleteLounge = async (request: Request, response: Response) => {
    const { loungeId } = request.params;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
        return ;
    }

    try {
        const lounge = await Lounge.findOne({
            attributes: ['profileId'],
            where: { id: loungeId }
        })
        const reply = await Replyoflounge.findAll({
            attributes: ['id'],
            where: { loungeId: loungeId }
        })
        // check authority
        if (lounge!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        reply!.forEach(async (element) => {
            await Likereply.destroy({
                where: { replyofloungeId: element!.id }
            });
        })
        await Likelounge.destroy({
            where: { loungeId: loungeId }
        });
        await Replyoflounge.destroy({
            where: { loungeId: loungeId }
        });
        await Lounge.destroy({
            where: { loungeId: loungeId }
        });
        response.status(200).json({ message: 'deleted successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const getReplyOfLounge = async (request: Request, response: Response) => {
    const { page, pageSize } = request.query;
    const { loungeId } = request.params;
    let limit, offset;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
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
        const reply = await Replyoflounge.findAndCountAll({
            attributes: [
                'loungeId',
                'comment',
                'like',
                'createdAt',
                'updatedAt'
            ],
            include: {
                model: Profile,
                attributes: ['id'],
                include: [{
                    model: User,
                    attributes: ['profileImage', 'username']
                }]
            },
            offset: offset,
            limit: limit
        })
        response.status(200).json({ reply });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const postReplyOfLounge = async (request: Request, response: Response) => {
    const { loungeId } = request.params;
    const { comment } = request.body;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
        return ;
    }

    try {
        const lounge = await Lounge.findOne({
            attributes: ['comment', 'replyCount', 'profileId'],
            where: { id: loungeId }
        })
        // renew replyCount
        await Lounge.update({
            replyCount: (lounge!.replyCount + 1)
        }, { where: { id: loungeId } })
        const feedComment = `${lounge!.comment.substr(0, 10)}...`

        await Replyoflounge.create({
            comment: comment,
            like: 0,
            profileId: request.user!.id,
            loungeId: loungeId,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        });
        response.status(200).json({ message: 'added successfully.' });

        // feed notification
        feed.replyoflounge(lounge!.profileId, request.user!.id, request.user!.username, Number(loungeId), feedComment);
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const updateReplyOfLounge = async (request: Request, response: Response) => {
    const { replyId } = request.params;
    const { comment } = request.body;
    if (replyId === undefined) {
        response.status(400).json({ errMessage: 'please input replyId query' });
        return ;
    }

    try {
        const reply = await Replyoflounge.findOne({
            attributes: ['profileId'],
            where: { id: replyId }
        })
        // check authority
        if (reply!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }

        await Replyoflounge.update({
            comment: comment,
            updatedAt: getIsoString()
        }, { where: { id: replyId } });
        response.status(200).json({ message: 'updated successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const deleteReplyOfLounge = async (request: Request, response: Response) => {
    const { replyId } = request.params;
    if (replyId === undefined) {
        response.status(400).json({ errMessage: 'please input replyId query' });
        return ;
    }

    try {
        const reply = await Replyoflounge.findOne({
            attributes: ['profileId'],
            include: {
                model: Lounge,
                attributes: ['replyCount']
            },
            where: { id: replyId }
        })
        // check authority
        if (reply!.profileId !== request.user!.id) {
            response.status(401).json({ errMessage: 'no authority' });
            return ;
        }
        // renew replyCount
        await Lounge.update({
            replyCount: (reply!.lounge.replyCount - 1)
        }, { where: { id: reply!.loungeId } })

        await Likereply.destroy({
            where: { replyofloungeId: replyId }
        });
        await Replyoflounge.destroy({
            where: { id: replyId }
        });
        response.status(200).json({ message: 'deleted successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const likeLounge = async (request: Request, response: Response) => {
    const { loungeId } = request.params;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
        return ;
    }

    try {
        const lounge = await Lounge.findOne({
            attributes: ['like'],
            where: { id: loungeId }
        })
        // renew like
        await Lounge.update({
            like: (lounge!.like + 1)
        }, { where: { id: loungeId } })

        await Likelounge.create({
            loungeId: loungeId,
            profileId: request.user!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        });
        response.status(200).json({ message: 'liked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const unlikeLounge = async (request: Request, response: Response) => {
    const { loungeId } = request.params;
    if (loungeId === undefined) {
        response.status(400).json({ errMessage: 'please input loungeId query' });
        return ;
    }

    try {
        const lounge = await Lounge.findOne({
            attributes: ['like'],
            where: { id: loungeId }
        })
        // renew like
        await Lounge.update({
            like: (lounge!.like - 1)
        }, { where: { id: loungeId } })

        await Likelounge.destroy({
            where: { loungeId: loungeId, profileId: request.user!.id }
        });
        response.status(200).json({ message: 'unliked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const likeReply = async (request: Request, response: Response) => {
    const { replyId } = request.params;
    if (replyId === undefined) {
        response.status(400).json({ errMessage: 'please input replyId query' });
        return ;
    }

    try {
        const reply = await Replyoflounge.findOne({
            attributes: ['like'],
            where: { id: replyId }
        })
        // renew like
        await Replyoflounge.update({
            like: (reply!.like + 1)
        }, { where: { id: replyId } })

        await Likereply.create({
            loungeId: replyId,
            profileId: request.user!.id,
            createdAt: getIsoString(),
            updatedAt: getIsoString()
        });
        response.status(200).json({ message: 'liked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}

export const unlikeReply = async (request: Request, response: Response) => {
    const { replyId } = request.params;
    if (replyId === undefined) {
        response.status(400).json({ errMessage: 'please input replyId query' });
        return ;
    }

    try {
        const reply = await Replyoflounge.findOne({
            attributes: ['like'],
            where: { id: replyId }
        })
        // renew like
        await Replyoflounge.update({
            like: (reply!.like - 1)
        }, { where: { id: replyId } })

        await Likereply.destroy({
            where: { loungeId: replyId, profileId: request.user!.id }
        });
        response.status(200).json({ message: 'unliked successfully.' });
    } catch (error) {
        response.status(405).json({ errMessage: String(error) });
        return ;
    }
}