import { Request, Response, NextFunction } from 'express';
import { FilterQuery, ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

import { Roles, Status } from '../constants/enums';
import Logger from '../helpers/logger';
import { UserModel, UsersFilterOptions } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';
import { JsonResponse } from '../interfaces/response.interfaces';

export const hasRole = (allowed_roles: Roles[]) => {
    return async (req: Request, res: Response<JsonResponse>, next: NextFunction) => {
        const uid = req.headers.authId;
        if (!uid) {
            res.status(500).json({
                response_data: null,
                errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
            });
        }

        const filter: FilterQuery<UserModel> = {
            _id: uid,
            status: Status.ACTIVE,
        };

        try {
            const filterOptions: UsersFilterOptions = {
                filter: { _id: uid, status: Status.ACTIVE },
            };

            filterOptions.projection = 'role';

            const user = await userServices.getOneUserByFilter(filterOptions);

            if (!user) {
                return res.status(401).json({
                    response_data: null,
                    errors: [{ msg: 'Something went wrong with your token, please relogin' }],
                });
            }

            if (!allowed_roles.includes(user.role)) {
                return res.status(403).json({
                    response_data: null,
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
                response_data: null,
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
    req: Request<{ id: string }>,
    res: Response<JsonResponse>,
    next: NextFunction
) => {
    const reqUID: string = req.params.id;
    const loggedUID = req.headers.authId;
    if (!loggedUID) {
        res.status(500).json({
            response_data: null,
            errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
        });
    }
    try {
        const filterOptions: UsersFilterOptions = {
            filter: { _id: loggedUID, status: Status.ACTIVE },
        };

        filterOptions.projection = 'role';
        const user = await userServices.getOneUserByFilter(filterOptions);

        if (!user) {
            return res.status(400).json({
                response_data: null,
                errors: [
                    {
                        msg: 'Something went wrong, please contact de admin',
                    },
                ],
            });
        }
        if (loggedUID !== reqUID) {
            if (![Roles.ADMIN, Roles.SUPER_ADMIN].includes(user.role)) {
                return res.status(403).json({
                    response_data: null,
                    errors: [
                        {
                            msg: 'You are not authorized to get the requested info.',
                        },
                    ],
                });
            }
        }
        req.headers.authRole = user.role;
        next();
    } catch (err) {
        Logger.error(err);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                response_data: null,
                errors: [
                    {
                        msg: 'Your token was exired, please, relogin',
                        param: 'token',
                        location: 'headers',
                    },
                ],
            });
        } else {
            return res.status(500).json({
                response_data: null,
                errors: [
                    {
                        msg: 'Something went wrong, please contact de admin',
                    },
                ],
            });
        }
    }
};

// };
