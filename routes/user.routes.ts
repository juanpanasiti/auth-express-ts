import { Router } from 'express';
import { check } from 'express-validator';

import { userFieldExists } from '../helpers/db-validators';
import { filterValidFields, fieldValidate, atLeastOneExists } from '../middlewares/field-middlewares';
import { validateJWT } from '../middlewares/jwt-middlewares';
import * as userControllers from '../controllers/user.controllers';
import { Roles } from '../constants/enums';
import { hasRole } from '../middlewares/role-middlewares';

const router = Router();

router.get(
    '/',
    [validateJWT, hasRole([Roles.ADMIN, Roles.SUPER_ADMIN]), fieldValidate],
    userControllers.getAllPaginated
);

export default router;
