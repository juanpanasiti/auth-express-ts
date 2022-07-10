import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const fieldValidate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors,
        });
    }
    next();
};

export const filterValidFields = (allowedFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const field in req.body) {
            if (!allowedFields.includes(field)) {
                delete req.body[field];
            }
        }
        next();
    };
};

export const atLeastOneExists = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let atLeastOneExists = false;
        fields.forEach((field) => {
            atLeastOneExists ||= !!req.body[field];
        });
        if (!atLeastOneExists) {
            return res.status(400).json({
                errors: ['You must send at least the username or the email.'],
            });
        }
        next();
    };
};