import { Router } from 'express';
import { check } from 'express-validator';

import { fieldValidate, filterValidFields } from '../middlewares/field-middlewares';
import { validateJWT } from '../middlewares/jwt-middlewares';
import * as userControllers from '../controllers/user.controllers';
import { Roles, Status } from '../constants/enums';
import { checkPermissionAndExistence, hasRole } from '../middlewares/role-middlewares';

const router = Router();

router.get(
    '/',
    [validateJWT, hasRole([Roles.ADMIN, Roles.SUPER_ADMIN]), fieldValidate],
    userControllers.getAllPaginated
);

router.get(
    '/:id',
    [
        validateJWT,
        check('id', "It isn't a valid uid.").isMongoId(),
        fieldValidate,
        checkPermissionAndExistence,
    ],
    userControllers.getUserById
);

router.put(
    '/:id',
    [
        validateJWT,
        filterValidFields(['username', 'password', 'email', 'img','status','role']),
        // hasRole([Roles.ADMIN, Roles.SUPER_ADMIN]),
        check('role', 'Role is invalid')
            .if((role: string) => !!role)
            .isIn(Object.values(Roles)),
        check('status', 'Status is invalid')
            .if((status: string) => !!status)
            .isIn(Object.values(Status)),
        fieldValidate,
        checkPermissionAndExistence,
    ],
    userControllers.updateUserById
);
router.delete('/:id', [validateJWT, hasRole([Roles.SUPER_ADMIN]), fieldValidate], userControllers.deleteUserById);

export default router;
