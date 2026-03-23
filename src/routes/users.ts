import express from 'express';
import {validate} from '../middleware/validate';
import {userSchema} from '../schemas/userSchema';
import * as UserController from '../controllers/userController';

const router = express.Router()
const jsonParser = express.json();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', jsonParser, validate(userSchema), UserController.createUser);

export default router;