import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { logger } from "../logger/logger.js";
const ssm = new SSMClient({ region: "us-east-1" });

export class GetEnv {
  public getDatabaseUrl = async function () {
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
    const command = new GetParameterCommand({
      Name: "/chomp/database-url",
      WithDecryption: true,
    });
    const response = await ssm.send(command);
    if (!response.Parameter?.Value) {
      logger.warn("Database URL not found");
      throw new Error("Database URL not found");
    }
    return response.Parameter?.Value;
  };
  public getJwtAccessKey = async function () {
    if (process.env.JWT_SECRET_KEY_ACCESS_TOKEN) {
      return process.env.JWT_SECRET_KEY_ACCESS_TOKEN;
    }
    const command = await new GetParameterCommand({
      Name: "/chomp/jwt-access-token",
      WithDecryption: true,
    });
    const response = await ssm.send(command);
    if (!response.Parameter?.Value) {
      logger.warn("JWT key not found");
      throw new Error("JWT key not found");
    }
    return response.Parameter.Value;
  };
  public getJwtRefreshKey = async function () {
    if (process.env.JWT_SECRET_KEY_REFRESH_TOKEN) {
      return process.env.JWT_SECRET_KEY_REFRESH_TOKEN;
    }
    const command = await new GetParameterCommand({
      Name: "/chomp/jwt-refresh-token",
      WithDecryption: true,
    });
    const response = await ssm.send(command);
    if (!response.Parameter?.Value) {
      logger.warn("JWT key not found");
      throw new Error("JWT key not found");
    }
    return response.Parameter.Value;
  };
}
