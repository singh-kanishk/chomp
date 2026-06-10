import express from "express";
import {Request, Response} from "express";
import {SignupDTO} from "@chomp/shared";

export class AuthController {
    public signUp = async (req: Request, res: Response) => {
        const body: SignupDTO = req.body;

    }
}