import express from 'express';
import {validate} from '../middleware/validate';
import {createLoanSchema} from '../schemas/loanSchema';
import * as LoanController from '../controllers/loanController';

const router = express.Router();
const jsonParser = express.json();

router.get('/', LoanController.getAllLoans);
router.post('/', jsonParser, validate(createLoanSchema), LoanController.loanBook);
router.post('/:id/return', jsonParser, LoanController.returnBook);

export default router;