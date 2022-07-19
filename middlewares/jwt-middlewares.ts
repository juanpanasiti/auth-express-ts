import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Logger from '../helpers/logger';
import { JWTPayload } from '../interfaces/auth.interfaces';
import { JsonResponse } from '../interfaces/response.interfaces';

export const validateJWT = (req: Request, res: Response<JsonResponse>, next: NextFunction) => {
    const token = req.header('g-token');

    // Check if the token is sended on the header request
    if (!token) {
        return res.status(401).json({
            response_data: null,
            errors: [
                {
                    msg: 'You are not authenticated',
                    param: 'token',
                    location: 'headers',
                },
            ],
        });
    }

    // If there a token, check if is valid
    try {
        const { uid } = jwt.verify(token, process.env.PRIVATE_JWT_KEY || '') as JWTPayload;

        if (!uid) {
            return res.status(401).json({
                response_data: null,
                errors: [
                    {
                        msg: 'The token is bad, please, relogin',
                        param: 'token',
                        location: 'headers',
                    },
                ],
            });
        }

        // if not fails, the token is good
        req.headers.authId = `${uid}`;
        next();
    } catch (err) {
        Logger.error(`${err}`);
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
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                response_data: null,
                errors: [
                    {
                        msg: 'Your token is not valid',
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
                    }
                    
                ],
            });
        }
    }
};
