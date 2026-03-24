import { Router } from 'express';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, refreshTokenSchema } from '../schemas/authSchema';
import * as AuthController from '../controllers/authController';

const router = Router();
const jsonParser = require('express').json();

router.post('/register', jsonParser, validate(registerSchema), AuthController.register);
router.post('/login', jsonParser, validate(loginSchema), AuthController.login);
router.post('/refresh', jsonParser, validate(refreshTokenSchema), AuthController.refresh);
router.post('/logout', jsonParser, validate(refreshTokenSchema), AuthController.logout);

export default router;