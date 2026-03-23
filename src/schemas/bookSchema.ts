import * as z from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, {error: 'Title is required'})
    .max(100, {error: 'Title must not be more than 100 characters'}),

  author: z
    .string()
    .min(1, {error: 'Author is required'})
    .max(100, {error: 'Author must not be more than 100 characters'}),

  year: z
    .number()
    .int({error: 'Year must be an integer'})
    .positive({error: 'Year must be positive'})
    .max(new Date().getFullYear(), {error: 'Year must not be in the future'}),

  isbn: z
    .string()
    .regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
      {error: 'ISBN must have a valid format'}),

  available: z.boolean()
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookDTO = z.infer<typeof createBookSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;