import { ObjectId } from "mongoose";

export interface LoginBody{
    email?: string,
    username?: string,
    password: string
}
export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}
export interface JWTPayload {
    uid: ObjectId
}