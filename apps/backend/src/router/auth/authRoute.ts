import express, { Request, Response } from "express";
import { db } from "../../index.js";
import { secretsTable, usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
export const authRouter: express.Router = express.Router();
import { type ApiResponse ,type SignupRequest,type SignupResponse } from "@chomp/shared";

authRouter.get(`/salt`, async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const result = await db
      .select({
        salt: secretsTable.saltUuid,
      })
      .from(secretsTable)
      .innerJoin(usersTable, eq(secretsTable.userId, usersTable.userId))
      .where(eq(usersTable.email, email as string))
      .limit(1);

    const response: ApiResponse<{ uuid: string }> = {
      statusCode: 200,
      success: true,
      body: { uuid: result[0].salt },
      message: "Salt Provided",
    };
    res.status(200).json(response);
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Unknown Error";
    }
    const obj: ApiResponse<null> = {
      success: false,
      statusCode: 500,
      message: "Unknown Error",
    };
    res.status(500).json(obj);
  }
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  try{
    const body:SignupRequest = req.body;
    const saltResult = await db.transaction(
        async (tx)=>{
          const result = await tx.insert(usersTable).values({email: body.email,name: body.name}).returning({insertedId:usersTable.userId});
          const id = result[0].insertedId
          const salt =await tx.insert(secretsTable).values({userId: id,authHash:body.authHash,saltUuid:body.salt}).returning({salt:secretsTable.saltUuid});
          return salt[0];
        }
    )
    const obj: ApiResponse<SignupResponse>= {
      success:true,
      statusCode: 200,
      message: "Salt Provided",
      body:saltResult
    }
    res.status(201).json(obj);
  }
  catch(error){
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Unknown Error";
    }
    const obj:ApiResponse<null>={
      success: false,
      message:errorMessage,
      statusCode: 500,
    }
    res.status(500).json(obj);
  }


});
