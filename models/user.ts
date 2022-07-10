import { Schema, model } from 'mongoose';
import { Roles, Status } from '../constants/enums';
import { UserModel } from '../interfaces/user.interface';

const UserSchema = new Schema<UserModel>({
    email: {
        type: String,
        required: [true, 'The email is mandatory.'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'The username is mandatory.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'The email is mandatory.'],
    },
    img: {
        type: String,
        defualt: null,
    },
    role: {
        type: String,
        required: true,
        default: Roles.USER,
        enum: Object.values(Roles),
    },
    status: {
        type: String,
        default: Status.ACTIVE, // ? Must be 'pending'?
        enum: Object.values(Status),
    },
    google: {
        type: Boolean,
        default: false,
    },
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

export default model('User', UserSchema);
