import { z } from "zod";
export declare const SignUpSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}>, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}>;
export type SignUpParams = z.infer<typeof SignUpSchema>;
