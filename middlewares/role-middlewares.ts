import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';

import { Roles, Status } from '../constants/enums';
import Logger from '../helpers/logger';
import { UserModel } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';

// type AllowedRoles = Object.values(Roles)
export const hasRole = (allowed_roles: Roles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.body;
        Logger.info(`UID: ${uid}`);
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
