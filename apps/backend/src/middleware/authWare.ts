import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthLocal } from "../modals/middlewareSchema/authSchema";

const accessSecret = process.env.JWT_SECRET_KEY_ACCESS_TOKEN || "";

export const requireAuth = (
  req: Request,
  res: Response<any, AuthLocal>,
  next: NextFunction,
): void => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res
      .status(401)
      .json({ message: "Authentication required. No access token provided." });
    return;
  }

  try {
    const decodedPayload = jwt.verify(accessToken, accessSecret);

    res.locals.user = decodedPayload;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({ message: "Access token expired. Please refresh." });
      return;
    }

    res.status(403).json({ message: "Invalid or malformed access token." });
    return;
  }
};
