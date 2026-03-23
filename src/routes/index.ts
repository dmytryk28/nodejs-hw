import express from 'express';
import userRoutes from './users';
import bookRoute from './books';
import loanRoute from './loans';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/books', bookRoute)
router.use('/loans', loanRoute);

export default router;