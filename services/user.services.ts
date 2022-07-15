import User from '../models/user';
import Logger from '../helpers/logger';
import { RegisterBody } from '../interfaces/auth.interfaces';
import { encrypt } from '../helpers/password';
import { EditableUserData, UserModel, UsersFilterOptions } from '../interfaces/user.interface';
import { FilterQuery } from 'mongoose';

export const countUsersByFilter = async (filterOptions: UsersFilterOptions) => {
    const { filter={} } = filterOptions;
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

export const getOneUserByFilter = async ({
    filter,
    options = null,
    projection = null,
}: UsersFilterOptions): Promise<UserModel | null> => {
    try {
        return await User.findOne(filter, projection, options);
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> getOneUserByFilter()', `${err}`);
        throw new Error(`${err}`);
    }
};

export const getManyUsersByFilter = async (filterOptions: UsersFilterOptions): Promise<UserModel[]> => {
    const { filter = {}, options = {}, projection = null } = filterOptions;
    try {
        return await User.find(filter, projection, options);
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> getManyUsersByFilter()', `${err}`);
        throw new Error(`${err}`);
    }
};

export const updateUserById = async (uid: string, payload: EditableUserData) => {
    try {
        return await User.findByIdAndUpdate(uid, payload, { new: true });
    } catch (err) {
        Logger.error('Error on .../services/user.services.ts -> updateUserById()', `${err}`);
        throw new Error(`${err}`);
    }
};
