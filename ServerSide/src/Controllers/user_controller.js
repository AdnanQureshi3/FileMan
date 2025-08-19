import User from "../models/user_Model.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();


export const register = async(req , res)=>{
    console.log("Registering user...");
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                msg: "Something is missing, please check.",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: `${email} email already registered, try different one`,
                success: false,
            });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(401).json({
                message: `${username} username already registered, try different one`,
                success: false,
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        user = await User.create({
            username,
            email,
            password: hashedpassword
        });

        return res.status(201).json({
            message: "Account created Successfully.",
            success: true,
            user
        })
    }
    catch (error) {
        console.log(error);
    }

}
export const login = async(req , res) =>{
    console.log("Logging in user..." , process.env.JWT_SECRET);
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                msg: "Something is missing, please check.",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: `User not found.`,
                success: false,
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: `Invalid credentials.`,
                success: false,
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({
            message: "Login successful.",
            success: true,
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
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: `User not found.`,
                success: false,
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        if(user._id !== userId || user.password !== hashedpassword) {
            return res.status(401).json({
                message: `Unauthorized access.`,
                success: false,
            });
        }

        await User.findByIdAndDelete(userId);

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