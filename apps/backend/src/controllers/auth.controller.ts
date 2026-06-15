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
import jwt from "jsonwebtoken";
import { JwtPayloadZod } from "@chomp/shared";

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
        return res.status(409).json(response);
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("SignUp Error:", errorMessage);

      const response: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json(response);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Get Salt Error:", errorMessage);
      const response: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json(response);
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
      const isHashCorrect = await authServices.compareAuthHash(
        authHash,
        userData?.authHash || "",
      );
      if (!isHashCorrect) {
        const payload: ApiResponse<null> = {
          success: false,
          statusCode: 401,
          message: "Invalid credentials",
        };
        res.status(401).json(payload);
        return;
      }
      const accessToken = authServices.generateAccessToken({ email });
      const refreshToken = authServices.generateRefreshToken({ email });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
      await authServices.storeRefreshToken(refreshToken, email);
      const payload: ApiResponse<null> = {
        success: true,
        message: "Successfull Login",
        statusCode: 200,
      };
      res.status(200).json(payload);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Login Error:", errorMessage);
      const payload: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json(payload);
    }
  };
  public refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      const payload: ApiResponse<null> = {
        statusCode: 401,
        success: false,
        message: "User Needs To Re Authenticate",
      };
      res.status(401).json(payload);
      return;
    }
    try {
      const decoded = authServices.checkRefreshToken(refreshToken);
      const { email } = JwtPayloadZod.parse(decoded);
      const isRefreshTokenRelatedToUSer =
        await authServices.verifyRefreshTokenToUser(email, refreshToken);
      if (!isRefreshTokenRelatedToUSer) {
        const payload: ApiResponse<null> = {
          statusCode: 409,
          success: false,
          message: "Incorrect Token Re Log In",
        };
        res.status(409).json(payload);
        return;
      }
      const newAccessToken = authServices.generateAccessToken({ email });

      // 5. Attach the new Access Token to the response as a cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      // 6. Send success response so the frontend knows it can retry its failed request
      res.status(200).json({ message: "Access token successfully refreshed" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Refresh Token Error:", errorMessage);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

      const payload: ApiResponse<null> = {
        statusCode: 403,
        success: false,
        message: "Invalid or expired refresh session. Please log in again.",
      };
      res.status(403).json(payload);
    }
  };
}
