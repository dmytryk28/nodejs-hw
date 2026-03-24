import prisma from '../db/prisma';
import type {CreateBookDTO, UpdateBookDTO} from '../schemas/bookSchema';

class BookService {
  findAll() {
    return prisma.book.findMany();
  }

  findById(id: string) {
    return prisma.book.findUnique({where: {id}});
  }

  async existsIsbn(isbn: string, excludeId?: string) {
    const book = await prisma.book.findUnique({where: {isbn}});
    if (!book) return false;
    return book.id !== excludeId;
  }

  create(dto: CreateBookDTO) {
    return prisma.book.create({data: dto});
  }

  update(id: string, dto: UpdateBookDTO) {
    return prisma.book.update({where: {id}, data: dto});
  }

  setAvailable(id: string, available: boolean) {
    return prisma.book.update({where: {id}, data: {available}});
  }

  delete(id: string) {
    return prisma.book.delete({where: {id}});
  }
}

export const bookService = new BookService();