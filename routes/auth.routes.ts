import { Router } from 'express';
import { check } from 'express-validator';

import * as authControllers from '../controllers/auth.controllers';
import { userFieldExists } from '../helpers/db-validators';
import { filterValidFields, fieldValidate, atLeastOneExists } from '../middlewares/field-middlewares';
// TODO: controllers, helpers and validators

const router = Router();

router.post(
    '/register',
    [
        filterValidFields(['username', 'password', 'email']),
        check('password', 'Password is mandatory and must have 8 chars min.').isLength({ min: 8 }),
        check('email', 'The email is invalid').isEmail(),
        check('username', 'The username must have between 8 and 16 characters.').isLength({ min: 8, max: 16 }),
        check('email').custom((value) => userFieldExists('email', value)),
        check('username').custom((value) => userFieldExists('username', value)),
        fieldValidate,
    ],
    authControllers.register
);

router.post(
    '/login',
    [
        atLeastOneExists(['username', 'email']),
        check('email', 'The email is invalid')
            .if((value:string) => !!value)
            .isEmail(),
        check('password', 'Password is mandatory').not().isEmpty(),
        fieldValidate,
    ],
    authControllers.login
);

export default router;
