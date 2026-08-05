import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { logger } from "../logger/logger.js";

const ssm = new SSMClient({ region: "us-east-1" });

export class GetEnv {
  public getDatabaseUrl = async function () {
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
    try {
      const command = new GetParameterCommand({
        Name: "/chomp/database-url",
        WithDecryption: true,
      });
      const response = await ssm.send(command);
      if (!response.Parameter?.Value) {
        logger.warn("Database URL parameter found in SSM but value is empty");
        throw new Error("Database URL not found in SSM");
      }
      return response.Parameter.Value;
    } catch (error) {
      logger.error(
        { error },
        "Failed to retrieve /chomp/database-url from AWS SSM",
      );
      throw error;
    }
  };

  public getJwtAccessKey = async function () {
    if (process.env.JWT_SECRET_KEY_ACCESS_TOKEN) {
      return process.env.JWT_SECRET_KEY_ACCESS_TOKEN;
    }
    try {
      const command = new GetParameterCommand({
        Name: "/chomp/jwt-access-token",
        WithDecryption: true,
      });
      const response = await ssm.send(command);
      if (!response.Parameter?.Value) {
        logger.warn("JWT access token parameter in SSM is empty");
        throw new Error("JWT key not found in SSM");
      }
      return response.Parameter.Value;
    } catch (error) {
      logger.error(
        { error },
        "Failed to retrieve /chomp/jwt-access-token from AWS SSM",
      );
      throw error;
    }
  };

  public getJwtRefreshKey = async function () {
    if (process.env.JWT_SECRET_KEY_REFRESH_TOKEN) {
      return process.env.JWT_SECRET_KEY_REFRESH_TOKEN;
    }
    try {
      const command = new GetParameterCommand({
        Name: "/chomp/jwt-refresh-token",
        WithDecryption: true,
      });
      const response = await ssm.send(command);
      if (!response.Parameter?.Value) {
        logger.warn("JWT refresh token parameter in SSM is empty");
        throw new Error("JWT key not found in SSM");
      }
      return response.Parameter.Value;
    } catch (error) {
      logger.error(
        { error },
        "Failed to retrieve /chomp/jwt-refresh-token from AWS SSM",
      );
      throw error;
    }
  };
}
