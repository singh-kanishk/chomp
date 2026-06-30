import { Request, Response } from "express";

import { AuthLocal } from "../modals/middlewareSchema/authSchema";
import { ApiResponse, GetCredentialResponse } from "@chomp/shared";
import { JwtPayloadZod } from "@chomp/shared";
import { ApiServices } from "../services/api.services";
import { GetCredentialRequestZod, VaultMutationRequestZod, DeleteCredentialRequestZod } from "@chomp/shared";

const apiService = new ApiServices();
export class ApiController {
  public async getCredentials(req: Request, res: Response<any, AuthLocal>) {
    try {
      const userDetails = res.locals.user;
      if (typeof userDetails != "object") {
        const payload: ApiResponse<null> = {
          statusCode: 401,
          success: false,
          message: "Incorrect token Re - Login",
        };
        res.status(401).json(payload);
        return;
      }

      const credentialQuery = GetCredentialRequestZod.parse(req.query);
      const { email } = JwtPayloadZod.parse(userDetails);
      const credential = await apiService.getCredential(email, credentialQuery);

      const mappedCredentials = credential.query.map((item) => ({
        credentialName: item.credentialId,
        credentialData: item.credentialPayload,
      }));

      const payload: ApiResponse<GetCredentialResponse> = {
        success: true,
        statusCode: 200,
        body: { credentials: mappedCredentials, nextOffset: credential.nextOffset },
        message: "Successfull",
      };
      res.status(200).json(payload);
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      const payload: ApiResponse<null> = {
        statusCode: 500,
        success: false,
        message: errorMessage,
      };
      res.status(500).json(payload)
    }
  }

  public async postCredential(req: Request, res: Response<any, AuthLocal>) {
    try {
      const userDetails = res.locals.user;
      if (typeof userDetails != "object") {
        return res.status(401).json({ statusCode: 401, success: false, message: "Incorrect token" });
      }

      const body = VaultMutationRequestZod.parse(req.body);
      const { email } = JwtPayloadZod.parse(userDetails);
      
      await apiService.addCredential(email, body.credentialId, body.credentialData);

      const payload: ApiResponse<null> = {
        success: true,
        statusCode: 201,
        message: "Credential added successfully",
      };
      res.status(201).json(payload);
    } catch (error) {
      res.status(500).json({ statusCode: 500, success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  public async putCredential(req: Request, res: Response<any, AuthLocal>) {
    try {
      const userDetails = res.locals.user;
      if (typeof userDetails != "object") {
        return res.status(401).json({ statusCode: 401, success: false, message: "Incorrect token" });
      }

      const body = VaultMutationRequestZod.parse(req.body);
      const { email } = JwtPayloadZod.parse(userDetails);
      
      await apiService.updateCredential(email, body.credentialId, body.credentialData);

      const payload: ApiResponse<null> = {
        success: true,
        statusCode: 200,
        message: "Credential updated successfully",
      };
      res.status(200).json(payload);
    } catch (error) {
      res.status(500).json({ statusCode: 500, success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  public async deleteCredential(req: Request, res: Response<any, AuthLocal>) {
    try {
      const userDetails = res.locals.user;
      if (typeof userDetails != "object") {
        return res.status(401).json({ statusCode: 401, success: false, message: "Incorrect token" });
      }

      const body = DeleteCredentialRequestZod.parse(req.body);
      const { email } = JwtPayloadZod.parse(userDetails);
      
      await apiService.deleteCredential(email, body.credentialId);

      const payload: ApiResponse<null> = {
        success: true,
        statusCode: 200,
        message: "Credential deleted successfully",
      };
      res.status(200).json(payload);
    } catch (error) {
      res.status(500).json({ statusCode: 500, success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }
}
