import { Request, Response } from "express";

export const tokenValidator = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({message: "Valid"});
};