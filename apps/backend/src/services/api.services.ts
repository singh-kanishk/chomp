import { db } from "../index";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger/logger";
import {
  usersTable,
  secretsTable,
  sessionTable,
  credentialsTable,
} from "../modals/SchemaDb/schema";
import { AuthServices } from "./auth.services";
import { ApiResponse, GetCredentialRequest } from "@chomp/shared";
const authService = new AuthServices();

export class ApiServices {
  public async getCredential(
    email: string,
    { offset, limit }: GetCredentialRequest,
  ) {
    const isUserPresent = await authService.isUserPresent(email);
    if (!isUserPresent) {
      logger.warn("User Is Not Present");
      throw new Error("User Is Not Present");
    }
    const userId = await authService.getUserIdFromEmail(email);
    const query = await db.query.credentialsTable.findMany({
      where: eq(credentialsTable.userId, userId),
      columns: {
        credentialId: true,
        credentialPayload: true,
      },
      limit: limit,
      offset: offset,
    });
    logger.info(`Total ${query.length} Credentials Provided `);
    return { query, nextOffset: offset + limit };
  }

  public async addCredential(
    email: string,
    credentialId: string,
    credentialPayload: string
  ) {
    try {
      const isUserPresent = await authService.isUserPresent(email);
      if (!isUserPresent) throw new Error("User Is Not Present");
      const userId = await authService.getUserIdFromEmail(email);
      await db.insert(credentialsTable).values({
        userId,
        credentialId,
        credentialPayload,
      });
      logger.info(`Credential added for user ${userId}`);
    } catch (error) {
      logger.warn("Unsuccessful Credential Addition");
      throw error;
    }
  }

  public async updateCredential(
    email: string,
    credentialId: string,
    credentialPayload: string
  ) {
    try {
      const isUserPresent = await authService.isUserPresent(email);
      if (!isUserPresent) throw new Error("User Is Not Present");
      const userId = await authService.getUserIdFromEmail(email);
      await db
        .update(credentialsTable)
        .set({ credentialPayload })
        .where(
          and(
            eq(credentialsTable.credentialId, credentialId),
            eq(credentialsTable.userId, userId)
          )
        );
      logger.info(`Credential updated for user ${userId}`);
    } catch (error) {
      logger.warn("Unsuccessful Credential Update");
      throw error;
    }
  }

  public async deleteCredential(email: string, credentialId: string) {
    try {
      const isUserPresent = await authService.isUserPresent(email);
      if (!isUserPresent) throw new Error("User Is Not Present");
      const userId = await authService.getUserIdFromEmail(email);
      await db
        .delete(credentialsTable)
        .where(
          and(
            eq(credentialsTable.credentialId, credentialId),
            eq(credentialsTable.userId, userId)
          )
        );
      logger.info(`Credential deleted for user ${userId}`);
    } catch (error) {
      logger.warn("Unsuccessful Credential Deletion");
      throw error;
    }
  }
}
