import User from "../models/user_Model.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();


export const register = async(req , res)=>{
    console.log("Registering user...");
    console.log(req.body);
    if (req.body._id) delete req.body._id;
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
console.log("New User Created:", user._id);


        return res.status(201).json({
            message: "Account created Successfully.",
            success: true,
            
        })
    }
    catch (error) {
        if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  res.status(500).json({ message: "Something went wrong" });
    }

}
export const login = async(req , res) =>{
    console.log("Logging in user..." , req.body);
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
        if(user.isPremium == true && user.premiumExpiry < Date.now()){
            user.isPremium = false;
            user.filesizeLimit = 10;
            user.TotalSizeLimit = 25;

            await user.save();
        }
        const { password: _, ...safeUser } = user._doc;

        
        return res.status(200).json({
            message: "Login successful.",
            success: true,
            user: safeUser
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

export const purchasePremium = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(401).json({
            msg: "User not authenticated.",
            success: false,
        });
    }
    try {
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                msg: "User not found.",
                success: false,
            });
        }
        const {paymentDetails} = req.body;
        // if (user.isPremium) {
        //     return res.status(400).json({
        //         msg: "User is already a premium member.",
        //         success: false,
        //     });
        // }
        user.isPremium = true;
        user.filesizeLimit = paymentDetails.filesizeLimit;
        user.TotalSizeLimit = paymentDetails.totalSizeLimit;
        user.premiumExpiry = new Date(Date.now() + paymentDetails.days * 24 * 60 * 60 * 1000); 
        await user.save();
        return res.status(200).json({
            msg: "Premium membership purchased successfully.",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Something went wrong.",
            success: false,
        });
    }
}