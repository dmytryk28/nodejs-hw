import express from 'express';
import {validate} from '../middleware/validate';
import {createBookSchema, updateBookSchema} from '../schemas/bookSchema';
import * as BookController from '../controllers/bookController';

const router = express.Router();
const jsonParser = express.json();

router.get('/:id', BookController.getBookById);
router.get('/', BookController.getAllBooks);
router.post('/', jsonParser, validate(createBookSchema), BookController.createBook);
router.put('/:id', jsonParser, validate(updateBookSchema), BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

export default router;