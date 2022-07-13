import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import Logger from './logger';

export const generateJWT = (uid: ObjectId | string) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        const secret = process.env.PRIVATE_JWT_KEY || ''
        jwt.sign(
            payload,
            secret,
            {
                expiresIn: '24h',
            },
            (err, token) => {
                if (err) {
                    Logger.error(`${err}`);
                    reject(`Something went wrong with the token generation (${err}).`);
                } else {
                    resolve(token);
                }
            }
        );
    });
};
