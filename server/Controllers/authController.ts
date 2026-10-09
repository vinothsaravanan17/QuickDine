import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../model/Users.js";
import bcrypt from 'bcrypt'
import { ifError } from "node:assert";
/// helper to generate jwt token

function generateToken(id:string) {
    return jwt.sign({id}, process.env.JWT_SECRET as string,{expiresIn:'30d'})
}

/// Api for REgister user
/// api/auth/register

export const registerUser = async (req: Request, res:Response) => {
       const {name, email, password, phone, role} = req.body

        try {
            
       if(!name || !email || !password){
          return res.status(400).json({message: 'please fill all the required field'})
       }

       // check user existing 
       const existingUser = await User.findOne({email});
        if (existingUser) {
         return res.status(400).json({message: 'user already existing'})
       }

       /// hashpassword 
       const salt = await bcrypt.genSalt(10);
       const hashpassword = await bcrypt.hash(password, salt)

      /// create user 

      const user = await User.create({
         name:name,
         email:email,
         password:hashpassword,
         phone:phone,
         role:role
      })

       if (user) {
         return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            phone:user.phone,
            role:user.role
         })

       } else {
         return res.status(400).json({message:'user data invalid'})
       }

        } catch (error: any) {
             console.error(error);
             res.status(400).json({message:error.message})
        }

}


/// Api for Login user
/// api/auth/login

export const LoginUser = async (req:Request, res:Response) => {
    try {
        const {password, email} = req.body;

        if (!password || !email) {
           return res.status(400).json({message:'All field is required'})
        }
      
    /// check existing user 
       const existingUser = await User.findOne({email});
       if (!existingUser) {
         return res.status(400).json({message:'invalid email or password'})
       }
    /// check password 
    const comparepassword = await bcrypt.compare(password, existingUser.password || '')
    if (! comparepassword) {
        return res.status(400).json({message:'password is invalid'})
    }

    res.json({
        _id:existingUser._id,
        name:existingUser.name,
        email:existingUser.email,
        password:existingUser.password,
        phone:existingUser.phone,
        role:existingUser.role,
        token: generateToken(existingUser._id.toString())
    })

    } catch (error: any) {
        console.error(error);
        res.status(400).json({message:error.message})
    }
}