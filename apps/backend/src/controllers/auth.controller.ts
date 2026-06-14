import express, { response } from "express";
import { Request, Response } from "express";
import {
  LogInRequest,
  LogInRequestZod,
  SignUpRequest,
  SignUpRequestZod,
} from "@chomp/shared";
import { AuthServices } from "../services/auth.services";
import { ApiResponse } from "@chomp/shared";
import { EmailSchema } from "@chomp/shared";

const authServices = new AuthServices();
export class AuthController {
  public signUp = async (req: Request, res: Response) => {
    try {
      const body = SignUpRequestZod.parse(req.body);
      const isUserPresent = await authServices.isUserPresent(body.email);
      if (isUserPresent) {
        const response: ApiResponse<null> = {
          success: false,
          statusCode: 409,
          message: "User Already Exists",
        };
        return res.status(409).json({ response });
      }

      const hashedAuthHash = await authServices.hashService(body.authHash);
      const payload: SignUpRequest = { ...body, authHash: hashedAuthHash };
      await authServices.createUser(payload);
      const response: ApiResponse<null> = {
        success: true,
        statusCode: 201,
        message: "User Created",
      };
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }

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

  public salt = async (req: Request, res: Response) => {
    try {
      const { email } = EmailSchema.parse({ email: req.query.email });
      const isUserPresent = await authServices.isUserPresent(email);
      if (!isUserPresent) {
        const response: ApiResponse<null> = {
          success: false,
          statusCode: 404,
          message: "User Not Found",
        };
        return res.status(404).json(response);
      }
      const salt = await authServices.getSalt(email);
      const response: ApiResponse<string> = {
        success: true,
        statusCode: 200,
        message: "Salt Retrieved",
        body: salt,
      };
      return res.status(200).json(response);
    } catch {
      console.error("Internal Server Error");
      const payload: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json({ payload });
    }
  };
  public login = async (req: Request, res: Response) => {
    try {
      const { email, authHash }: LogInRequest = LogInRequestZod.parse(req.body);
      const isUserPresent = await authServices.isUserPresent(email);
      if (!isUserPresent) {
        const payload: ApiResponse<null> = {
          success: false,
          statusCode: 404,
          message: "User Not Found",
        };
        res.status(404).json(payload);
        return;
      }
      const userData = await authServices.getUserData(email);
      const isHashCorrect = authServices.compareAuthHash(
        authHash,
        userData?.authHash || "",
      );
      if (!isHashCorrect) {
        const payload: ApiResponse<null> = {
          success: false,
          statusCode: 409,
          message: "Internal Server Error",
        };
        res.status(409).json(payload);
        return;
      }
      const payload: ApiResponse<null> = {
        success: true,
        message: "Successfull Login",
        statusCode: 200,
      };
      res.status(200).json(payload);
    } catch (error) {
      let errorMessage: string = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      const payload: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: errorMessage || "Internal Server Error",
      };
      res.status(404).json(payload);
    }
  };
}
