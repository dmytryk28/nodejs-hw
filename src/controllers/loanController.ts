import type {Request, Response} from 'express';
import {loanService} from '../services/loanService';
import {bookService} from '../services/bookService';
import type {CreateLoanDTO} from '../schemas/loanSchema';

export async function getAllLoans(req: Request, res: Response) {
  const loans =
    req.user!.role === 'ADMIN'
      ? await loanService.findAll()
      : await loanService.findByUser(req.user!.id);
  res.status(200).json(loans);
}

export async function loanBook(req: Request<{}, {}, CreateLoanDTO>, res: Response) {
  const book = await bookService.findById(req.body.bookId);
  if (!book) return res.status(404).json({error: 'Book not found'});
  if (!book.available) return res.status(400).json({error: 'Book is not available for lending'});

  await bookService.setAvailable(book.id, false);
  const loan = await loanService.create(req.user!.id, req.body.bookId);
  res.status(201).json(loan);
}

export async function returnBook(req: Request<{ id: string }>, res: Response) {
  const loan = await loanService.findById(req.params.id);
  if (!loan) return res.status(404).json({error: 'Loan not found'});
  if (loan.status === 'RETURNED') return res.status(400).json({error: 'Book is already returned'});

  if (req.user!.role !== 'ADMIN' && loan.userId !== req.user!.id) {
    return res.status(403).json({error: 'Forbidden: this is not your loan'});
  }

  await bookService.setAvailable(loan.bookId, true);
  res.status(200).json(await loanService.returnLoan(loan.id));
}