export interface LoginPayload {
  uuid: string;
}

export interface SignupDTO {
  name: string;
  email: string;
  authHash: string;
  salt: string;
}
