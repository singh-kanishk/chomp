import { db } from "../index";
import { eq } from "drizzle-orm";
import { logger } from "../logger/logger";
import {
  usersTable,
  secretsTable,
  sessionTable,
  credentialsTable,
} from "../modals/SchemaDb/schema";
import { AuthServices } from "./auth.services";
const authService = new AuthServices();

export class ApiServices {
  public async getCredential(email: string) {
    const isUserPresent = await authService.isUserPresent(email);
    if (!isUserPresent) {
      logger.warn("User isnt Present");
      throw new Error("Invalid User");
    }
    const { userId, ...credential } = credentialsTable;
    const query = await db
      .select({ credential })
      .from(usersTable)
      .leftJoin(
        credentialsTable,
        eq(usersTable.userId, credentialsTable.userId),
      );

    return query.length != 0 ? query : null;
  }
}
