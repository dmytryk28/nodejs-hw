import type {Request, Response} from 'express';
import type {CreateLoanDTO} from '../schemas/loanSchema';
import {loanService} from '../services/loanService';
import {userService} from '../services/userService';
import {bookService} from '../services/bookService';

export function getAllLoans(_: Request, res: Response) {
  res.status(200).json(loanService.findAll());
}

export function loanBook(req: Request<{}, {}, CreateLoanDTO>, res: Response) {
  const user = userService.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }
  const book = bookService.findById(req.body.bookId);
  if (!book) {
    return res.status(404).json({error: 'Book not found'});
  }
  if (!book.available) {
    return res.status(400).json({error: 'Book is not available for lending'});
  }
  const loan = loanService.loan(req.body);
  bookService.setAvailable(book, false);
  res.status(201).json(loan);
}

export function returnBook(req: Request<{ id: string; }>, res: Response) {
  const loan = loanService.findById(req.params.id);
  if (!loan) {
    return res.status(404).json({error: 'Loan not found'});
  }
  if (loan.status === 'RETURNED') {
    return res.status(400).json({error: 'Book is already returned'});
  }
  const book = bookService.findById(loan.bookId);
  if (!book) {
    return res.status(404).json({error: 'Book not found'});
  }
  bookService.setAvailable(book, true);
  res.status(200).json(loanService.return(loan));
}