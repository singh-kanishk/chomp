export interface LoginPayload{
    uuid:string;
}


export interface SignupRequest{
    name: string;
    email: string;
    authHash: string;
    salt: string;
}