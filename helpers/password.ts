import bcryptjs from 'bcryptjs';

export const encrypt = (password: string) => {
    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);

    return encryptedPassword;
};

export const check = (inputPassword: string, userPassword: string) => {
    return !!bcryptjs.compareSync(inputPassword, userPassword);
};
