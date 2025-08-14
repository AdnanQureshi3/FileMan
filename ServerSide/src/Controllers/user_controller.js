import User from '../models/user_model.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'


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