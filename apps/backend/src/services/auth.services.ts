import argon2 from "argon2";
import { db } from "../index";
import { usersTable, secretsTable } from "../db/schema";
import { SignUpRequest } from "@chomp/shared";
import { eq } from "drizzle-orm";

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
  }
  public async getSalt(email: string) {
    const userIdObj = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    const { userId } = userIdObj[0];
    const salt = await db
      .select({ salt: secretsTable.saltUuid })
      .from(secretsTable)
      .where(eq(secretsTable.userId, userId));
    return salt[0].salt;
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
  public async compareAuthHash(serverHash: string, dbHash: string) {
    return await argon2.verify(dbHash, serverHash);
  }
}
