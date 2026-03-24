import type {Request, Response} from 'express';
import type {CreateBookDTO, UpdateBookDTO} from '../schemas/bookSchema';
import {bookService} from '../services/bookService';

export async function getAllBooks(_: Request, res: Response) {
  res.status(200).json(await bookService.findAll());
}

export async function getBookById(req: Request<{ id: string }>, res: Response) {
  const book = await bookService.findById(req.params.id);
  if (!book) return res.status(404).json({error: 'Book not found'});
  res.status(200).json(book);
}

export async function createBook(
  req: Request<{}, {}, CreateBookDTO>,
  res: Response
) {
  const isbnTaken = await bookService.existsIsbn(req.body.isbn);
  if (isbnTaken) return res.status(400).json({error: 'ISBN already exists'});
  const book = await bookService.create(req.body);
  res.status(201).json(book);
}

export async function updateBook(
  req: Request<{ id: string }, {}, UpdateBookDTO>,
  res: Response
) {
  const existing = await bookService.findById(req.params.id);
  if (!existing) return res.status(404).json({error: 'Book not found'});

  if (req.body.isbn) {
    const isbnTaken = await bookService.existsIsbn(req.body.isbn, req.params.id);
    if (isbnTaken) return res.status(400).json({error: 'ISBN already exists'});
  }

  const book = await bookService.update(req.params.id, req.body);
  res.status(200).json(book);
}

export async function deleteBook(req: Request<{ id: string }>, res: Response) {
  const existing = await bookService.findById(req.params.id);
  if (!existing) return res.status(404).json({error: 'Book not found'});
  await bookService.delete(req.params.id);
  res.status(204).send();
}