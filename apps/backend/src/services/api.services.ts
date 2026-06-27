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
import { ApiResponse, GetCredentialRequest } from "@chomp/shared";
const authService = new AuthServices();

export class ApiServices {
  public async getCredential(email: string, credentials: GetCredentialRequest) {
    const isUserPresent = authService.isUserPresent(email);
    if (!isUserPresent) {
      logger.warn("User Is Not Present")
      throw new Error("User Is Not Present")      
    }
    const userId = await authService.getUserIdFromEmail(email);
    const query = await db.query.credentialsTable.findMany({
      where:eq(credentialsTable.userId,userId),
      columns:{
        credentialId:true,
        credentialPayload:true
      },
      limit:credentials.limit,
      offset:credentials.offset           
    })
    logger.info(`Total ${query.length} Credentials Provided `)
    return query
  }
}
