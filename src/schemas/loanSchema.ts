import * as z from 'zod';

export const createLoanSchema = z.object({
  bookId: z.uuid({error: 'Book ID must be UUID'}),
});

export type CreateLoanDTO = z.infer<typeof createLoanSchema>;