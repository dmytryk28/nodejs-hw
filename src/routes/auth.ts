import {Router} from 'express';
import {validate} from '../middleware/validate';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../schemas/authSchema';
import * as AuthController from '../controllers/authController';

const router = Router();
const jsonParser = require('express').json();

router.post('/register', jsonParser, validate(registerSchema), AuthController.register);
router.post('/login', jsonParser, validate(loginSchema), AuthController.login);
router.post('/refresh', jsonParser, validate(refreshTokenSchema), AuthController.refresh);
router.post('/logout', jsonParser, validate(refreshTokenSchema), AuthController.logout);
router.post('/request-password-reset', jsonParser, validate(requestPasswordResetSchema), AuthController.requestPasswordReset);
router.post('/reset-password', jsonParser, validate(resetPasswordSchema), AuthController.resetPassword);

export default router;