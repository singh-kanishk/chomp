export const getSharedMessage = () => {
    return "Hello from the @repo/shared package!";
};
export const BaseUrl = {
    server: "http://localhost:3000",
    client: "http://localhost:5173",
    db: "http://localhost:5433",
};
export * from "./zod/form/login-form";
export * from "./zod/form/signup-form";
export * from "./types";
