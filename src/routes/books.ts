import {Router} from 'express';
import express from 'express';
import {validate} from '../middleware/validate';
import {createBookSchema, updateBookSchema} from '../schemas/bookSchema';
import {authenticate} from '../middleware/auth';
import {requireRole} from '../middleware/role';
import * as BookController from '../controllers/bookController';

const router = Router();
const jsonParser = express.json();
const adminOnly = [authenticate, requireRole('ADMIN')] as const;

router.get('/', BookController.getAllBooks);
router.get('/:id', BookController.getBookById);
router.post('/', jsonParser, ...adminOnly, validate(createBookSchema), BookController.createBook);
router.put('/:id', jsonParser, ...adminOnly, validate(updateBookSchema), BookController.updateBook);
router.delete('/:id', ...adminOnly, BookController.deleteBook);

export default router;