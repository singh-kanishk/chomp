import { Request, Response } from "express";

import { AuthLocal } from "../modals/middlewareSchema/authSchema";
import { ApiResponse } from "@chomp/shared";
import { JwtPayloadZod } from "@chomp/shared";
import { ApiServices } from "../services/api.services";

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
      const { email } = JwtPayloadZod.parse(userDetails.user);
      const credential = await apiService.getCredential(email);

      const payload: ApiResponse<typeof credential> = {
        success: true,
        statusCode: 200,
        body: credential || [],
        message: "Successfull",
      };
      res.status(200).json(payload);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      const payload: ApiResponse<null>={
        statusCode:500,
        success:false,
        message:errorMessage
      }
    }
  }
}
