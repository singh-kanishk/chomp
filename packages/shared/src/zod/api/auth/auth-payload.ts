export interface LoginPayload{
    uuid:string;
}

export interface SignupResponse{
    salt: string;
}
export interface SignupRequest{
    name: string;
    email: string;
    authHash: string;
}