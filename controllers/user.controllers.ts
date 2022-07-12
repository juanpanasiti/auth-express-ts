import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { Status } from '../constants/enums';
import Logger from '../helpers/logger';
import { PaginationQuery } from '../interfaces/path.interfaces';

import { UsersFilterOptions } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';

export const getAllPaginated = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
    const { skip = 0, limit = 10 } = req.query;

    try {
        const filterOptions: UsersFilterOptions = {
            filter: { $or: [{ status: Status.ACTIVE }, { status: Status.PENDING }] },
        };
        const countProm = userServices.countUsersByFilter(filterOptions);
        filterOptions.options = {
            limit,
            skip,
        };
        filterOptions.projection = 'username email img role'
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
