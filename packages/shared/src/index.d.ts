export declare const getSharedMessage: () => string;
export type UserContext = {
    id: string;
    role: "admin" | "user";
};
export declare const BaseUrl: {
    readonly server: "http://localhost:3000";
    readonly client: "http://localhost:5173";
    readonly db: "http://localhost:5433";
};
export * from "./zod/form/login-form";
export * from "./zod/form/signup-form";
export * from "./types";
