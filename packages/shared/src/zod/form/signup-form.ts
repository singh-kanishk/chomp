import { z } from "zod";

//regex
const nameRegex = /^[a-zA-Z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignUpSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { error: "Minimum name length is 3" })
      .regex(nameRegex, { error: "Name can only contain letters and spaces" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .regex(
        passwordRegex,
        { error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
export type SignUpParams = z.infer<typeof SignUpSchema>;