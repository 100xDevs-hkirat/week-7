import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, Admin } from '../db/index';
import { Request, Response, NextFunction } from 'express';
import {Admin as AdminType, User as UserType} from "../utilities/schema_interfaces";

const SECRET: string = 'Test@12345_SECr3t'; 
// secret key for JWT token generation and verification.

// generate jwt token
export const create_token = (payload: object | string): string => {
    return jwt.sign(payload, SECRET, {algorithm: 'HS256', expiresIn: "1h"});
}

// grab username from token
export const token_decrypter = (fieldName: string, token: string): string | null => {
    const decodedToken: string | JwtPayload = jwt.verify(token, SECRET) as JwtPayload;
    if(decodedToken.hasOwnProperty(fieldName))
      return decodedToken[fieldName];
    else return null;  
}



// check for valid credentials
export const token_validator = async (token: string | undefined | null): Promise<boolean> => {
    let valid:boolean = false;
    let valid_account: AdminType | UserType | null;
    if(! token) return valid;
    token = token.split(" ")[1];
    try{
      const username: string | null = token_decrypter('username', token);
      const role: string | null = token_decrypter('role', token);
      if(role === 'admin'){
        valid_account = await Admin.findOne({username});
      }else{
        valid_account = await User.findOne({username});
      }
      if(valid_account) valid = true;
    }catch(err){
      return false;
    }
    return valid;
  }

  // Authenticate user at middleware level
export const authenticator_middleWare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if(req.url.includes('/signup') || req.url.includes('/login')) next();
    else {
      const authenticated: boolean = await token_validator(req.headers.authorization);
      authenticated ? next() : res.status(401).json({message:"Access denied"});
    }
  }

 