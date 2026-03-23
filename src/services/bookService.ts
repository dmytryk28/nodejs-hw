import {db} from '../storage/db';
import type {CreateBookDTO, UpdateBookDTO} from '../schemas/bookSchema';
import type {Book} from '../types/book';

class BookService {
  findAll(): Book[] {
    return db.books.getAll();
  }

  findById(id: string): Book | undefined {
    return db.books.getById(id);
  }

  existsId(id: string): boolean {
    return db.books.getById(id) !== undefined;
  }

  setAvailable(book: Book, available: boolean): Book {
    const updatedBook: Book = {
      ...book,
      available
    }
    db.books.save(updatedBook);
    return updatedBook;
  }

  create(dto: CreateBookDTO): Book {
    const book: Book = {
      id: crypto.randomUUID(),
      ...dto
    }
    db.books.save(book);
    return book;
  }

  update(id: string, dto: UpdateBookDTO): Book {
    const book = db.books.getById(id)!;
    const updatedBook: Book = {
      ...book,
      ...dto
    }
    db.books.save(updatedBook);
    return updatedBook;
  }

  delete(id: string): boolean {
    return db.books.delete(id);
  }
}

export const bookService = new BookService();