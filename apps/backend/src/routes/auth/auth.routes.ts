import express from "express";
export const authRouter = express.Router();
import { AuthController } from "../../controllers/auth.controller.js";

const authController = new AuthController();

authRouter.post("/signup", authController.signUp);
authRouter.get("/salt", authController.salt);
authRouter.post("/login", authController.login);
authRouter.post("/refresh");
// authRouter.get(`/salt`, async (req: Request, res: Response) => {
//   try {
//     const { email } = req.query;
//
//     const result = await db
//         .select({
//           salt: secretsTable.saltUuid,
//         })
//         .from(secretsTable)
//         .innerJoin(usersTable, eq(secretsTable.userId, usersTable.userId))
//         .where(eq(usersTable.email, email as string))
//         .limit(1);
//
//     const response: ApiResponse<{ uuid: string }> = {
//       statusCode: 200,
//       success: true,
//       body: { uuid: result[0].salt },
//       message: "Salt Provided",
//     };
//     res.status(200).json(response);
//   } catch (error) {
//     let errorMessage;
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = "Unknown Error";
//     }
//     const obj: ApiResponse<null> = {
//       success: false,
//       statusCode: 500,
//       message: "Unknown Error",
//     };
//     res.status(500).json(obj);
//   }
//
// });
