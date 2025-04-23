import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  age: z.nullable(z.number()),
  createdAt: z.string(),
  updatedAt: z.string(),
}); 