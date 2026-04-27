import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LogInSchema = z
  .object({
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .regex(
        passwordRegex,
        { error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }
      )
  })
 
export type LoginParams= z.infer<typeof LogInSchema>;