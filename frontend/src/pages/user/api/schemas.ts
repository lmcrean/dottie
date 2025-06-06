import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  age: z.nullable(z.number()),
  created_at: z.string(),
  updated_at: z.string()
});
