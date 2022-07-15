import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { Roles, Status } from '../constants/enums';
import Logger from '../helpers/logger';
import { encrypt } from '../helpers/password';
import { PaginationQuery } from '../interfaces/path.interfaces';
import { JsonResponse } from '../interfaces/reqRes.interfaces';

import { EditableUserData, UsersFilterOptions } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';

export const getAllPaginated = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
    const { skip = 0, limit = 2 } = req.query;

    try {
        const filterOptions: UsersFilterOptions = {
            filter: { $or: [{ status: Status.ACTIVE }, { status: Status.PENDING }] },
            // filter: {
            //     status: Status.DELETED
            // }
        };
        const countProm = userServices.countUsersByFilter(filterOptions);
        filterOptions.options = {
            limit,
            skip,
        };
        filterOptions.projection = 'username email img role status';
        const userProm = userServices.getManyUsersByFilter(filterOptions);

        const [users, total] = await Promise.all([userProm, countProm]);

        res.status(200).json({
            response_data: {
                users,
                total,
            },
            errors: [],
        });
    } catch (err) {
        Logger.error(`${err}`);
        res.status(500).json({
            errors: [err],
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const uid = req.params.id;

    try {
        const filterOptions: UsersFilterOptions = {
            filter: { _id: uid, status: Status.ACTIVE },
        };

        filterOptions.projection = 'username email img role';
        const user = await userServices.getOneUserByFilter(filterOptions);

        if (!user) {
            return res.status(404).json({ errors: [`User ${uid} not found.`] });
        }

        res.status(200).json({
            response_data: user,
            errors: [],
        });
    } catch (err) {
        Logger.error(`${err}`);
        res.status(500).json({
            errors: [err],
        });
    }
};

export const updateUserById = async (
    req: Request<{ id: string }, {}, EditableUserData>,
    res: Response<JsonResponse>
) => {
    const { password, email, username, img, status, role } = req.body;
    const uid = req.params.id;
    const authRole: string = req.headers.authRole as string;
    const editPayload: EditableUserData = {};
    switch (authRole) {
        case Roles.SUPER_ADMIN:
            if (email) {
                editPayload.email = email;
            }
            if (username) {
                editPayload.username = username;
            }
            if (role) {
                editPayload.role = role;
            }
        case Roles.ADMIN:
            if (status) {
                editPayload.status = status;
            }
        case Roles.USER:
            if (img) {
                editPayload.img = img;
            }
            if (password) {
                editPayload.password = encrypt(password);
            }
            break;
        default:
            throw new Error("This wasn't supposed to happen");
    }
    try {
        const userEdited = await userServices.updateUserById(uid, editPayload);
        if (!userEdited) {
            res.status(404).json({
                response_data: null,
                errors: [`User ${uid} not found`],
            });
        }
        res.status(200).json({
            response_data: userEdited,
            errors: [],
        });
    } catch (err) {
        res.status(500).json({
            response_data: null,
            errors: [`${err}`],
        });
    }

    // return res.status(501).json('not implemented.. yet');
};

export const deleteUserById = async (req: Request, res: Response) => {
    const uid = req.params.id;
    const editPayload: EditableUserData = {
        status: Status.DELETED
    };
    try {
        const userDeleted = await userServices.updateUserById(uid, editPayload);
        if (!userDeleted) {
            res.status(404).json({
                response_data: null,
                errors: [`User ${uid} not found`],
            });
        }
        res.status(200).json({
            response_data: userDeleted,
            errors: [],
        });
    } catch (err) {
        res.status(500).json({
            response_data: null,
            errors: [`${err}`],
        });
    }
};
