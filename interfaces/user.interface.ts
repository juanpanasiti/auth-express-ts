import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { Roles, Status } from '../constants/enums';

export interface UserModel {
    _id?: ObjectId;
    email: string;
    username: string;
    password: string;
    img: string | null;
    role: Roles;
    status: Status;
    google: boolean;
}

export interface EditableUserData {
    email?: string;
    username?: string;
    password?: string;
    img?: string | null;
    role?: Roles;
    status?: Status;
}

export interface UsersFilterOptions {
    filter: FilterQuery<UserModel> | undefined;
    projection?: ProjectionType<UserModel> | null | undefined;
    options?: QueryOptions<UserModel> | null | undefined;
}
