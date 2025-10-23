import User from "../models/user_Model.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { registerSchema  , loginSchema} from "../../Validation/UserValidation.js";
dotenv.config();


export const register = async(req , res)=>{
    console.log("Registering user...");
    console.log(req.body);
    // if (req?.body?._id) delete req.body._id;
    try {
        const { username, email, password } = req.body;
       const result = registerSchema.safeParse(req.body);
     
        
if (!result.success) {
    
    const err = result.error.issues[0].message;
    console.log(err);
    return res.status(400).json({
        message: err,
        success: false
    });
}
        if (!username || !email || !password) {
            return res.status(401).json({
                msg: "Something is missing, please check.",
                success: false,
            });
        }
       
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(401).json({
                message: `${email} email already registered, try different one`,
                success: false,
            });
        }
        user = await prisma.user.findUnique({ where: { username } });
       
        if (user) {
            return res.status(401).json({
                message: `${username} username already registered, try different one`,
                success: false,
            });
        }
        console.log("Checking for existing user...");
        const hashedpassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedpassword
            }
        });
        console.log("Checking for existing user...");
       console.log("New User Created:", user.id);


        return res.status(201).json({
            message: "Account created Successfully.",
            success: true,
            
        })
    }
    catch (error) {
        console.log("Error during registration:", error);
    return res.status(400).json({ message: `${error.message}` });
  }
  res.status(500).json({ message: "Something went wrong" });
    }


export const login = async(req , res) =>{
    console.log("Logging in user..." , req.body);
    try{
            const result = loginSchema.safeParse(req.body);
            console.log(result);

if (!result.success) {
    
    const err = result.error.issues[0].message;
    console.log(err);
    return res.status(400).json({
        message: err,
        success: false
    });
}

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check.",
                success: false,
            });
        }
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: `User not found.`,
                success: false,
                user,
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: `Invalid credentials.`,
                success: false,
            });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        if(user.isPremium == true && user.premiumExpiry < Date.now()){
           user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    isPremium: false,
                    filesizeLimit: 10,
                    TotalSizeLimit: 25,
                    premiumExpiry: null,
                }
            });
        }
        const { password: _, ...safeUser } = user;
         res.cookie('token', token, { httpOnly: true, secure:true , sameSite: 'none', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user:safeUser,
            token
        });


    }
    catch (error) {
        console.log(error);
    }
}


export const deleteUser = async(req , res)=>{
    
    try {
        const userId = req.id;
        const {password} = req.body
        if (!userId || !password) {
            return res.status(401).json({
                msg: "Password is missing.",
                success: false,
            });
        }
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: `User not found.`,
                success: false,
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        if(user.id !== userId || user.password !== hashedpassword) {
            return res.status(401).json({
                message: `Unauthorized access.`,
                success: false,
            });
        }

        await prisma.user.delete({ where: { id: userId } });

        return res.status(201).json({
            message: "Account deleted Successfully.",
            success: true,
            user
        })
    }
    catch (error) {
        console.log(error);
    }

}
export const purchasePremium = async ({ paymentDetails }) => {
    console.log("Processing premium purchase...", paymentDetails);
    const userId = paymentDetails.userId;

    if (!userId) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            return { success: false, message: "User not found." };
        }
        
        if (user.isVerified === false) {
            return { success: false, message: "Please verify your email to purchase premium." };
        }

        if (user.plan === paymentDetails.plan && user.isPremium === true) {
            return { success: false, message: `You are already on the ${user.plan} plan.` };
        }

        // Calculate the new expiry date
        const newPremiumExpiry = new Date(
            Date.now() + paymentDetails.days * 24 * 60 * 60 * 1000
        );

        // FIX: Use prisma.user.update() to commit changes to the database
        await prisma.user.update({
            where: { id: userId },
            data: {
                isPremium: true,
                filesizeLimit: paymentDetails.filesizeLimit,
                TotalSizeLimit: paymentDetails.totalSizeLimit,
                premiumExpiry: newPremiumExpiry,
                plan: paymentDetails.plan,
            }
        });

        return { success: true, message: "Premium membership purchased successfully." };
    } catch (error) {
        console.error("Error during premium purchase:", error); // Changed log for clarity
        return { success: false, message: "Something went wrong." };
    }
};
export const logout = async (req, res) => {
    try {
        console.log("logout")
        return res.cookie('token', "", { maxAge: 0 }).json({
            msg: "Logout successfully",
            success: true
        })

    }
    catch (err) {
        console.log(err);
    }
};
export const verifyuser = async (req, res) => {
    try {
        const {otp} = req.body;
        const id = req.id;
        // console.log("Verifying user with OTP:", otp, "for user ID:", id);
        const user = await prisma.user.findUnique({ where: { id } });
        if(user.otpExpiry < Date.now()){
            return res.status(401).json({
                message: "OTP expired.",
                success: false
            });
        }

        if(user.otp != otp ){
            return res.status(401).json({
                message: "Invalid OTP.",
                success: false
            });
        }

        
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,   
                otp: undefined,
                otpExpiry: undefined
            }
        });

        return res.status(200).json({
            message: "User verified successfully.",
            success: true,
            user
        });
    }
    catch(error){
        
    }
}
export const verifyOTPForPasswordreset = async (req, res) => {
    try {
        const {otp , email} = req.body;
     
        console.log("Verifying user with OTP:", otp, "for user ID:", email);
        const user = await prisma.user.findUnique({ where: { email } });
        if(user.otpExpiry < Date.now()){
            return res.status(401).json({
                message: "OTP expired.",
                success: false
            });
        }

        if(user.otp != otp ){
            return res.status(401).json({
                message: "Invalid OTP.",
                success: false
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,   
                otp: undefined,
                otpExpiry: undefined
            }
        });

        return res.status(200).json({
            message: "User verified successfully.",
            success: true,
            user
        });
    }
    catch(error){
        
    }
}

export const resetPassword = async(req , res) =>{
    console.log("reseting password");
    try{
      
         const { email, password } = req.body;
         console.log(email , password);
        const user = await prisma.user.findUnique({ where: { email } });

        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        const old = user.password;
        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword;

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedpassword }
        });

        return res.status(200).json({
            message:"Password reset Successfully",
            success:true,
            old

        })
    }
    catch(error){
        console.log(error);
    }
}
export const isEmailExist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email exists",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
