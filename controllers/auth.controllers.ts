import { Request, Response } from 'express';

import { Status } from '../constants/enums';
import { generateJWT } from '../helpers/jwt';
import Logger from '../helpers/logger';
import { check } from '../helpers/password';
import { UserModel, UsersFilterOptions } from '../interfaces/user.interface';
import * as userServices from '../services/user.services';

export const register = async (req: Request, res: Response) => {
    try {
        const newUser = await userServices.createUser(req.body);

        res.status(201).json({
            response_data: newUser,
            errors: [],
        });
    } catch (err) {
        Logger.error('Error on .../controllers/auth.controllers.ts -> register()', `${err}`);
        res.status(400).json({
            errors: [err],
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        let user: UserModel | null;

        // Checks if user exist on DB (by email or username)
        const filterOptions: UsersFilterOptions = { filter: undefined}
        if (email) {
            filterOptions.filter = {email}
        } else {
            filterOptions.filter = {username}
        }
        filterOptions.filter['status'] = Status.ACTIVE
        filterOptions.projection = 'username email img role password';
        user = await userServices.getOneUserByFilter(filterOptions);

        if (!user) {
            return res.status(400).json({
                errors: ['Incorrect credentials, try again.'],
            });
        }

        // Checks password
        if (!check(password, user.password)) {
            return res.status(400).json({
                errors: ['Incorrect credentials, try again.'],
            });
        }

        // Generate JWT
        const jwt = await generateJWT(user._id!);

        return res.json({
            response_data: {
                user,
                token: jwt,
            },
            errors: [],
        });
    } catch (err) {
        Logger.error('Error on .../controllers/auth.controllers.ts -> login()', `${err}`);
        res.status(400).json({
            errors: [err],
        });
    }
};

export const renewJWT = async (req: Request, res: Response) => {
    const uid = req.headers.authId;

    try {
        const token = await generateJWT(`${uid}`);
        return res.status(200).json({
            response_data: token,
        });
    } catch (err) {
        Logger.error(`${err}`);
        res.status(500).json({ errors: [err] });
    }
};
