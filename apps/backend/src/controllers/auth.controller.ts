import express from "express";
import { Request, Response } from "express";
import { SignUpRequest } from "@chomp/shared";

export class AuthController {
  public signUp = async (req: Request, res: Response) => {
    const body: SignUpRequest = req.body;
  };
}

// authRouter.post("/signup", async (req: Request, res: Response) => {
//   try{

//     const body= signupRequestSchema.parse(req.body);
//     const serverAuthHash = await argon2.hash(body.authHash, {
//       type: argon2.argon2id,
//       memoryCost: 65536, // 64 MB
//       timeCost: 3,       // 3 passes
//       parallelism: 4,    // utilizes multiple cores if available
//     });
//      await db.transaction(
//         async (tx)=>{
//           const result = await tx.insert(usersTable).values({email: body.email,name: body.name}).returning({insertedId:usersTable.userId});
//           const id = result[0].insertedId
//           await tx.insert(secretsTable).values({userId: id,authHash:serverAuthHash,saltUuid:body.salt});
//         }
//     )
//     const obj: ApiResponse<null>= {
//       success:true,
//       statusCode: 201,
//       message: "User created",
//     }
//     res.status(201).json(obj);
//   }
//   catch(error){
//     let errorMessage;
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = "Unknown Error";
//     }
//     const obj:ApiResponse<null>={
//       success: false,
//       message:"Conflict",
//       statusCode: 500,
//     }
//     res.status(500).json(obj);
//   }
// });
