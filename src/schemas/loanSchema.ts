import * as z from 'zod';

export const createLoanSchema = z.object({
  userId: z.uuid({error: 'User ID must be UUID'}),
  bookId: z.uuid({error: 'Book ID must be UUID'})
});

export type CreateLoanDTO = z.infer<typeof createLoanSchema>;