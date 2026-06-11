import argon2 from "argon2";
import { db } from "../index";
import { usersTable, secretsTable } from "../db/schema";
import { SignUpRequest } from "@chomp/shared";

export class AuthServices {
  public async hashService(data: string) {
    return await argon2.hash(data);
  }
  public async isUserPresent(data: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, data),
    });
    return user ? true : false;
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
}
