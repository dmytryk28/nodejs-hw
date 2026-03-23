import {db} from '../storage/db';
import type {Loan} from '../types/loan';
import type {CreateLoanDTO} from '../schemas/loanSchema';

class LoanService {
  findAll(): Loan[] {
    return db.loans.getAll();
  }

  findById(id: string): Loan | undefined {
    return db.loans.getById(id);
  }

  loan(dto: CreateLoanDTO): Loan {
    const loan: Loan = {
      ...dto,
      id: crypto.randomUUID(),
      loanDate: new Date(),
      returnDate: null,
      status: 'ACTIVE'
    }
    db.loans.save(loan);
    return loan;
  }

  return(loan: Loan): Loan {
    const updatedLoan: Loan = {
      ...loan,
      returnDate: new Date(),
      status: 'RETURNED'
    }
    db.loans.save(updatedLoan);
    return updatedLoan;
  }
}

export const loanService = new LoanService();