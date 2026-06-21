import argon2 from "argon2";
import { db } from "../index";
import {
  usersTable,
  secretsTable,
  sessionTable,
} from "../modals/SchemaDb/schema";
import { SignUpRequest } from "@chomp/shared";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { type JwtPayloadInterface } from "@chomp/shared";

export class AuthServices {
  private async getUserIdFromEmail(email: string) {
    const query = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (query.length === 0) {
      throw new Error("User Not Found");
    }
    const { userId } = query[0];
    return userId;
  }
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
    const result = await db
      .select({
        userId: usersTable.userId,
        name: usersTable.name,
        email: usersTable.email,
        authHash: secretsTable.authHash,
      })
      .from(usersTable)
      .innerJoin(secretsTable, eq(usersTable.userId, secretsTable.userId))
      .where(eq(usersTable.email, email))
      .limit(1);

    // result will be an array: [] if no user found, or [{ userId, name, email, authHash }]
    if (result.length === 0) {
      return null;
    }

    return result[0];
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
    const userId = await this.getUserIdFromEmail(email);
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
  public async storeRefreshToken(refreshToken: string, email: string) {
    try {
      const userId = await this.getUserIdFromEmail(email);

      const query = await db
        .insert(sessionTable)
        .values({ userId, refreshToken });
    } catch (error) {
      throw error;
    }
  }
}
