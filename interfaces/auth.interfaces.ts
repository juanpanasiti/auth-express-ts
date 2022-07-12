import { ObjectId } from "mongoose";

export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}
export interface JWTPayload {
    uid: ObjectId
}