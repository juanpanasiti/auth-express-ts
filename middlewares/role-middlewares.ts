import { Request, Response, NextFunction } from 'express';
import { FilterQuery, ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

import { Roles, Status } from '../constants/enums';
import Logger from '../helpers/logger';
import { UserModel } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';

// type AllowedRoles = Object.values(Roles)
export const hasRole = (allowed_roles: Roles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const uid = req.headers.authId;
        if (!uid) {
            res.status(500).json({
                errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
            });
        }

        const filter: FilterQuery<UserModel> = {
            _id: uid,
            status: Status.ACTIVE,
        };

        try {

            const user = await userServices.getOneUserByFilter(filter, 'role');

            if (!user) {
                return res.status(401).json({
                    errors: ['Something went wrong with your token, please relogin'],
                });
            }

            if (!allowed_roles.includes(user.role)) {
                return res.status(403).json({
                    errors: [
                        {
                            msg: `You have no enough range! Sorry!`,
                        },
                    ],
                });
            }
            next();
        } catch (err) {
            Logger.error(err);
            res.status(500).json({
                errors: [
                    {
                        msg: `Something went wrong! contact the admin!`,
                    },
                ],
            });
        }
    };
};

export const checkPermissionAndExistence = async (
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
) => {
    const reqUID: string = req.params.id.toString();

    const loggedUID = req.headers.authId;
    if (!loggedUID) {
        res.status(500).json({
            errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
        });
    }

    try {
        if (loggedUID !== reqUID) {
            // const { role } = await userServices.getUserById(loggedUID, ['role']);
            const filter: FilterQuery<UserModel> = {
                id: loggedUID,
            };
            const user = await userServices.getOneUserByFilter(filter, 'role');

            if (!user) {
                return res.status(400).json({ errors: ['Something went wrong with your token, please relogin'] });
            }

            if (![Roles.ADMIN, Roles.SUPER_ADMIN].includes(user.role)) {
                return res.status(403).json({
                    errors: [
                        {
                            msg: 'You are not authorized to get the requested info.',
                        },
                    ],
                });
            }
        }
        next()
    } catch (err) {
        Logger.error(err);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Your token was exired, please, relogin',
                        param: 'token',
                        location: 'header',
                    },
                ],
            });
        } else {
            return res.status(500).json({
                errors: ['Something went wrong, please contact de admin'],
            });
        }
    }
};
