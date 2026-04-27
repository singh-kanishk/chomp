
export const getSharedMessage = (): string => {
  return "Hello from the @repo/shared package!";
};

export type UserContext = {
  id: string;
  role: 'admin' | 'user';
};

export * from './zod/form/login-form'
export * from './zod/form/signup-form'
