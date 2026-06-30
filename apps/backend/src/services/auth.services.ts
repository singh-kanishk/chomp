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
import { logger } from "../logger/logger";

export class AuthServices {
  public async getUserIdFromEmail(email: string) {
    const query = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (query.length === 0) {
      logger.warn("User Not Present In Database");
      throw new Error("User Not Found");
    }
    const { userId } = query[0];
    logger.info(`User Id :${userId}`);
    return userId;
  }
  public async hashService(data: string) {
    logger.info("hashing data");
    return await argon2.hash(data);
  }
  public async isUserPresent(email: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    logger.info(
      user && user.isActive ? "User Is Present" : "User Is Not Present",
    );
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
      logger.info(`user created `);
    } catch (error) {
      logger.warn("Unsuccesful Account Creation");
      throw error;
    }
  }
  public async getSalt(email: string) {
    try {
      const userIdObj = await db
        .select({ userId: usersTable.userId })
        .from(usersTable)
        .where(eq(usersTable.email, email));
      if (userIdObj.length === 0) {
        logger.warn(
          "User Might Not exist error during salt fetch re login or  create account",
        );
        return;
      }
      const { userId } = userIdObj[0];
      const salt = await db
        .select({ salt: secretsTable.saltUuid })
        .from(secretsTable)
        .where(eq(secretsTable.userId, userId));

      if (salt.length > 0) {
        logger.info("Sent Salt");
        return salt[0].salt;
      }
    } catch (error) {
      logger.warn("Error in Salt Fetch");
      throw error;
    }
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
      const jwtToken= jwt.verify(token, refreshTokenKey);
      if(jwtToken){
        logger.info("Valid Refresh Token")
        return jwtToken
      }
    } catch (error) {
      logger.warn("Invalid Refresh Token")
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
      
    const isValid= checkRefreshToken.length > 0;
    if(!isValid){
      logger.warn("InValid Refresh Token")
      return false;
    }
    logger.info("Valid Refresh Token")
    return true;
  }
  public generateAccessToken(payload: JwtPayloadInterface) {
    const accessKey = process.env.JWT_SECRET_KEY_ACCESS_TOKEN || "";
    const token= jwt.sign(payload, accessKey, { expiresIn: 15 * 60 });
    logger.info("Generated Access Token")
    return token;
  }
  public generateRefreshToken(payload: JwtPayloadInterface) {
    const refreshKey = process.env.JWT_SECRET_KEY_REFRESH_TOKEN || "";
    const token= jwt.sign(payload, refreshKey, { expiresIn: 15 * 24 * 60 * 60 });
    logger.info("Generated Refresh Token")
    return token;
  }
  public async storeRefreshToken(refreshToken: string, email: string) {
    try {
      const userId = await this.getUserIdFromEmail(email);

      const query = await db
        .insert(sessionTable)
        .values({ userId, refreshToken });
        logger.info("Stored Refresh Token")
    } catch (error) {
      logger.info("Error Storing Refresh Token")
      throw error;
    }
  }
}
