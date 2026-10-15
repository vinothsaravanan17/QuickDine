import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../model/Users.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (req.header("authorization")?.startsWith("Bearer")) {
    try {
      token = req.header("authorization")?.split(" ")[1];
      const secret = process.env.JWT_SECRET;

      if (!token || !secret) {
        throw new Error("Missing token or JWT secret");
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(400).json({ message: "not authorizad, user not found" });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth Middleware error", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
      res.status(401).json({messsage:'not Authotized, No token'})
  }
  
};
