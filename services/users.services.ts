import User from '../models/user';
import Logger from '../helpers/logger';
import { RegisterBody } from '../interfaces/auth.interfaces';
import { encrypt } from '../helpers/password';
import { UserModel } from '../interfaces/user.interface';

export const countUsersByFilter = async (filter: object) => {
    try {
        return await User.countDocuments(filter);
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> countUsersByFilter()', `${err}`);
        throw new Error(`${err}`);
    }
};

export const createUser = async (fields: RegisterBody) => {
    try {
        const newUser = new User(fields);

        // Encrypt password
        newUser.password = encrypt(fields.password);

        // Save
        await newUser.save();

        return newUser;
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> createUser()', `${err}`);
        throw new Error(`${err}`);
    }
};

export const getUserByFieldsFilter = async (filter: object): Promise<UserModel | null> => {
    try {
        return await User.findOne(filter);
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> getUserByFieldsFilter()', `${err}`);
        throw new Error(`${err}`);
    }
};
