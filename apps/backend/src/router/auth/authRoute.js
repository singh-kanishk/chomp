import express from "express";
import { db } from "../../index.js";
import { secretsTable, usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
export const authRouter = express.Router();
authRouter.get(`/salt`, async (req, res) => {
    try {
        const { email } = req.query;
        const result = await db
            .select({
            salt: secretsTable.saltUuid,
        })
            .from(secretsTable)
            .innerJoin(usersTable, eq(secretsTable.userId, usersTable.userId))
            .where(eq(usersTable.email, email))
            .limit(1);
        const response = {
            statusCode: 200,
            success: true,
            body: { uuid: result[0].salt },
            message: "Salt Provided",
        };
        res.status(200).json(response);
    }
    catch (error) {
        let errorMessage;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else {
            errorMessage = "Unknown Error";
        }
        const obj = {
            success: false,
            statusCode: 500,
            message: "Unknown Error",
        };
        res.status(500).json(obj);
    }
});
authRouter.post('/signup', async (req, res) => {
    const body = req.body;
});
