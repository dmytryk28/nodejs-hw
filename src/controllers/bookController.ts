import type {Request, Response} from 'express';
import type {CreateBookDTO, UpdateBookDTO} from '../schemas/bookSchema';
import {bookService} from '../services/bookService';

export function getBookById(req: Request<{ id: string; }>, res: Response) {
  const book = bookService.findById(req.params.id);
  if (!book) {
    return res.status(404).json({error: 'Book not found'});
  }
  res.status(200).json(book);
}

export function getAllBooks(_: Request, res: Response) {
  res.status(200).json(bookService.findAll());
}

export function createBook(req: Request<{}, {}, CreateBookDTO>, res: Response) {
  res.status(201).json(bookService.create(req.body));
}

export function updateBook(req: Request<{ id: string; }, {}, UpdateBookDTO>, res: Response) {
  if (!bookService.existsId(req.params.id)) {
    return res.status(404).json({error: 'Book not found'});
  }
  const updatedBook = bookService.update(req.params.id, req.body);
  res.status(200).json(updatedBook);
}

export function deleteBook(req: Request<{ id: string; }>, res: Response) {
  const isDeleted: boolean = bookService.delete(req.params.id);
  if (!isDeleted) {
    return res.status(404).json({error: 'Book not found'});
  }
  res.status(204).send();
}