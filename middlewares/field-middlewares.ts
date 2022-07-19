import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { JsonResponse } from '../interfaces/response.interfaces';

export const fieldValidate = (req: Request, res: Response<JsonResponse>, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            response_data: null,
            errors: errors,
        });
    }
    next();
};

export const filterValidFields = (allowedFields: string[]) => {
    return (req: Request, res: Response<JsonResponse>, next: NextFunction) => {
        for (const field in req.body) {
            if (!allowedFields.includes(field)) {
                delete req.body[field];
            }
        }
        next();
    };
};

export const atLeastOneExists = (fields: string[]) => {
    return (req: Request, res: Response<JsonResponse>, next: NextFunction) => {
        let atLeastOneExists = false;
        fields.forEach((field) => {
            atLeastOneExists ||= !!req.body[field];
        });
        if (!atLeastOneExists) {
            return res.status(400).json({
                response_data: null,
                errors: [
                    {
                        msg: 'You must send at least the username or the email.',
                        location: 'body',
                        param: 'username/email',
                    },
                ],
            });
        }
        next();
    };
};