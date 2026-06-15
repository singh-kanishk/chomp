import argon2 from "argon2";
import { db } from "../index";
import { usersTable, secretsTable, sessionTable } from "../db/schema";
import { SignUpRequest } from "@chomp/shared";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { type JwtPayloadInterface } from "@chomp/shared";

export class AuthServices {
  public async hashService(data: string) {
    return await argon2.hash(data);
  }
  public async isUserPresent(email: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    return user && user.isActive ? true : false;
  }
  public async createUser(body: SignUpRequest) {
    try {
      await db.transaction(async (tx) => {
        const result = await tx
          .insert(usersTable)
          .values({ email: body.email, name: body.encryptedName })
          .returning({ insertedId: usersTable.userId });
        const id = result[0].insertedId;
        await tx
          .insert(secretsTable)
          .values({ userId: id, authHash: body.authHash, saltUuid: body.salt });
      });
    } catch (error) {
      throw error;
    }
  }
  public async getSalt(email: string) {
    const userIdObj = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userIdObj.length === 0) {
      return;
    }
    const { userId } = userIdObj[0];
    const salt = await db
      .select({ salt: secretsTable.saltUuid })
      .from(secretsTable)
      .where(eq(secretsTable.userId, userId));
    if (salt.length > 0) return salt[0].salt;
  }
  public async getUserData(email: string) {
    const userData = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    const secretData = await db.query.secretsTable.findFirst({
      where: (secret, { eq }) => eq(secret.userId, userData?.userId || ""),
    });
    let payload;
    if (userData && secretData) {
      const { userId, ...userTableData } = userData;
      payload = { ...userTableData, authHash: secretData.authHash };
    }
    return payload;
  }
  public async compareAuthHash(receivedHash: string, dbHash: string) {
    return await argon2.verify(dbHash, receivedHash);
  }

  public checkRefreshToken(token: string) {
    try {
      const refreshTokenKey = process.env.JWT_SECRET_KEY_REFRESH_TOKEN || "";
      return jwt.verify(token, refreshTokenKey);
    } catch (error) {
      throw error;
    }
  }
  public async verifyRefreshTokenToUser(email: string, refreshToken: string) {
    const userIdQuery = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userIdQuery.length === 0) {
      return false;
    }
    const { userId } = userIdQuery[0];
    const checkRefreshToken = await db
      .select({ refreshToken: sessionTable.refreshToken })
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.refreshToken, refreshToken),
          eq(sessionTable.userId, userId),
        ),
      );
    return checkRefreshToken.length > 0;
  }
  public generateAccessToken(payload: JwtPayloadInterface) {
    const accessKey = process.env.JWT_SECRET_KEY_ACCESS_TOKEN || "";
    return jwt.sign(payload, accessKey, { expiresIn: 15 * 60 });
  }
  public generateRefreshToken(payload: JwtPayloadInterface) {
    const refreshKey = process.env.JWT_SECRET_KEY_REFRESH_TOKEN || "";
    return jwt.sign(payload, refreshKey, { expiresIn: 15 * 24 * 60 * 60 });
  }
}
