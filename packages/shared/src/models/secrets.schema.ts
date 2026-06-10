import {string, z} from "zod";

export const secretTable = z.object({
    userId:string(),
    saltUuid:string(),
    authHash:string()
})

export type secretTable = z.infer<typeof secretTable>