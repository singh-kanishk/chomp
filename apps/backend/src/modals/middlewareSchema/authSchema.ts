import jwt from "jsonwebtoken";
export interface AuthLocal extends Request {
  user?: string | jwt.JwtPayload;
}
