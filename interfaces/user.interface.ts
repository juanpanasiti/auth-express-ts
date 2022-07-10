import { ObjectId } from 'mongoose';
import { Roles, Status } from '../constants/enums';

export interface UserModel {
    _id?: ObjectId
    email: string;
    username: string;
    password: string;
    img: string | null;
    role: Roles;
    status: Status;
    google: boolean;
}
