import * as userServices from '../services/user.services';

export const userFieldExists = async (fieldName: string, fieldValue: string) => {
    const count = await userServices.countUsersByFilter({ [fieldName]: fieldValue });
    if (count > 0) {
        throw new Error(`The ${fieldName} ${fieldValue} is already taken!`);
    }
};
