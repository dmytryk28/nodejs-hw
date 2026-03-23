import type {User} from '../types/user';
import type {Book} from '../types/book';
import type {Loan} from '../types/loan';
import {Storage} from './storage';
import {join} from 'node:path';

const dbPath = join(process.cwd(), 'db');

export const db = {
  users: new Storage<User>(join(dbPath, 'users.json')),
  books: new Storage<Book>(join(dbPath, 'books.json')),
  loans: new Storage<Loan>(join(dbPath, 'loans.json'))
};