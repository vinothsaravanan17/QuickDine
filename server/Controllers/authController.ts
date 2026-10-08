import { request, response } from "express";
import jwt from 'jsonwebtoken';

/// helper to generate jwt token

// function generateToken(id:string) {
//     return jwt.sign(id, process.env.JWT_SECRET as string,{expiresIn:'30d'})
// }

/// 