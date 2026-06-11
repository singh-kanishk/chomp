import express, { response } from "express";
import { Request, Response } from "express";
import { SignUpRequest, SignUpRequestZod } from "@chomp/shared";
import { AuthServices } from "../services/auth.services";
import { ApiResponse } from "@chomp/shared";

export class AuthController {
  public signUp = async (req: Request, res: Response) => {
    const authServices = new AuthServices();
    try {
      const body = SignUpRequestZod.parse(req.body);
      const isUserPresent = await authServices.isUserPresent(body.email);
      if (isUserPresent) {
        const response: ApiResponse<null> = {
          success: false,
          statusCode: 409,
          message: "User Already Exists",
        };
        res.status(409).json({ response });
      }

      const hashedAuthHash = await authServices.hashService(body.authHash);
      const payload: SignUpRequest = { ...body, authHash: hashedAuthHash };
      authServices.createUser(payload);
      const response: ApiResponse<null> = {
        success: true,
        statusCode: 201,
        message: "User Created",
      };
      res.status(201).json(response);
    } catch {
      console.error("Error During SignUp");
      const response: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json({
        response,
      });
    }
  };

  public login = async (req: Request, res: Response) => {};
}
