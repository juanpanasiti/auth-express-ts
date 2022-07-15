import * as userServices from '../services/user.services';
import { UsersFilterOptions } from '../interfaces/user.interface';

export const userFieldExists = async (fieldName: string, fieldValue: string) => {
    const filterOptions: UsersFilterOptions = {
        filter: { [fieldName]: fieldValue },
    };
    const count = await userServices.countUsersByFilter(filterOptions);
    if (count > 0) {
        throw new Error(`The ${fieldName} ${fieldValue} is already taken!`);
    }
};
