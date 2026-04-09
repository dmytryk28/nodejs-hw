import {Router} from 'express';
import {authenticate} from '../middleware/auth';
import {requireRole} from '../middleware/role';
import {upload} from '../middleware/upload';
import * as UserController from '../controllers/userController';

const router = Router();
const adminOnly = [authenticate, requireRole('ADMIN')] as const;

router.get('/me', authenticate, UserController.getMe);
router.post('/me/avatar', authenticate, upload.single('avatar'), UserController.uploadAvatar);
router.delete('/me/avatar', authenticate, UserController.deleteAvatar);
router.get('/', ...adminOnly, UserController.getAllUsers);
router.get('/:id', ...adminOnly, UserController.getUserById);

export default router;