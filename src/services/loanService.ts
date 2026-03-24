import prisma from '../db/prisma';

class LoanService {
  findAll() {
    return prisma.loan.findMany({include: {book: true, user: false}});
  }

  findByUser(userId: string) {
    return prisma.loan.findMany({where: {userId}});
  }

  findById(id: string) {
    return prisma.loan.findUnique({where: {id}});
  }

  create(userId: string, bookId: string) {
    return prisma.loan.create({
      data: {userId, bookId},
    });
  }

  returnLoan(id: string) {
    return prisma.loan.update({
      where: {id},
      data: {returnDate: new Date(), status: 'RETURNED'},
    });
  }
}

export const loanService = new LoanService();