import {string, z} from 'zod'

export const usersTable = z.object({
    userId:string(),
    name:string(),
    email:string(),
    createdAt:string()
})

export type usersTableSchema = z.infer<typeof usersTable>

