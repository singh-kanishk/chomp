import { Request, Response, type CookieOptions } from "express";
import {
  LogInRequest,
  LogInRequestZod,
  SignUpRequest,
  SignUpRequestZod,
  ApiResponse,
  EmailSchema,
  JwtPayloadZod,
} from "@chomp/shared";
import { AuthServices } from "../services/auth.services.js";

const authServices = new AuthServices();
const isProduction = process.env.NODE_ENV === "production";
const getAuthCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  ...(maxAge ? { maxAge } : {}),
});

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
        message: errorMessage || "Internal Server Error",
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
        message: errorMessage || "Internal Server Error",
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
      const accessToken = await authServices.generateAccessToken({ email });
      const refreshToken = await authServices.generateRefreshToken({ email });

      res.cookie(
        "accessToken",
        accessToken,
        getAuthCookieOptions(15 * 60 * 1000),
      );
      res.cookie(
        "refreshToken",
        refreshToken,
        getAuthCookieOptions(15 * 24 * 60 * 60 * 1000),
      );
      await authServices.storeRefreshToken(refreshToken, email);
      const payload = {
        success: true,
        message: "Successfull Login",
        statusCode: 200,
        body: {
          protectedEncryptionKeyBase64: userData?.protectedEncryptionKeyBase64,
        },
      };
      res.status(200).json(payload);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Login Error:", errorMessage);
      const payload: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: errorMessage || "Internal Server Error",
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
      const decoded = await authServices.checkRefreshToken(refreshToken);
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
      const newAccessToken = await authServices.generateAccessToken({ email });

      res.cookie(
        "accessToken",
        newAccessToken,
        getAuthCookieOptions(15 * 60 * 1000),
      );

      res.status(200).json({ message: "Access token successfully refreshed" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Refresh Token Error:", errorMessage);
      res.clearCookie("accessToken", getAuthCookieOptions());
      res.clearCookie("refreshToken", getAuthCookieOptions());

      const payload: ApiResponse<null> = {
        statusCode: 403,
        success: false,
        message: "Invalid or expired refresh session. Please log in again.",
      };
      res.status(403).json(payload);
    }
  };

  public logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await authServices.deleteRefreshToken(refreshToken);
      }
      res.clearCookie("accessToken", getAuthCookieOptions());
      res.clearCookie("refreshToken", getAuthCookieOptions());

      const payload: ApiResponse<null> = {
        success: true,
        statusCode: 200,
        message: "Successfully logged out",
      };
      res.status(200).json(payload);
    } catch (error) {
      console.error("Logout Error:", error);
      const payload: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      };
      res.status(500).json(payload);
    }
  };
}
