import express from 'express';
import {validate} from '../middleware/validate';
import {createLoanSchema} from '../schemas/loanSchema';
import * as LoanController from '../controllers/loanController';
import {authenticate} from '../middleware/auth';

const router = express.Router();
const jsonParser = express.json();

router.get('/', authenticate, LoanController.getAllLoans);
router.post('/', jsonParser, authenticate, validate(createLoanSchema), LoanController.loanBook);
router.post('/:id/return', jsonParser, authenticate, LoanController.returnBook);

export default router;