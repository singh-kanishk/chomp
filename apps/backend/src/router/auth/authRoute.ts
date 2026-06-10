import express, { Request, Response } from "express";
import { db } from "../../index.js";
import { secretsTable, usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
export const authRouter = express.Router();
import {type ApiResponse, type SignupRequest, SignUpSchema} from "@chomp/shared";
import argon2 from "argon2";
import {z} from 'zod'



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

const signupRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  salt: z.string().uuid("Invalid salt format"),
  authHash: z.string().regex(/^[a-f0-9]{64}$/i, "Invalid auth hash format"),
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  try{

    const body= signupRequestSchema.parse(req.body);
    const serverAuthHash = await argon2.hash(body.authHash, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 passes
      parallelism: 4,    // utilizes multiple cores if available
    });
     await db.transaction(
        async (tx)=>{
          const result = await tx.insert(usersTable).values({email: body.email,name: body.name}).returning({insertedId:usersTable.userId});
          const id = result[0].insertedId
          await tx.insert(secretsTable).values({userId: id,authHash:serverAuthHash,saltUuid:body.salt});
        }
    )
    const obj: ApiResponse<null>= {
      success:true,
      statusCode: 201,
      message: "User created",
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
      message:"Conflict",
      statusCode: 500,
    }
    res.status(500).json(obj);
  }
});
