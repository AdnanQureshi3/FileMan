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
export const purchasePremium = async ({ paymentDetails }) => {
    console.log("Processing premium purchase...", paymentDetails);
  const userId = paymentDetails.userId;
  console
  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }
    if(user.isVerified === false){
        return { success: false, message: "Please verify your email to purchase premium." };
      }

  if(user.plan === paymentDetails.plan && user.isPremium === true){
    return { success: false, message: `You are already on the ${user.plan} plan.` };
  }

    user.isPremium = true;
    user.filesizeLimit = paymentDetails.filesizeLimit;
    user.TotalSizeLimit = paymentDetails.totalSizeLimit;
    user.premiumExpiry = new Date(
      Date.now() + paymentDetails.days * 24 * 60 * 60 * 1000
    );
    user.plan = paymentDetails.plan;
    

    await user.save();

    return { success: true, message: "Premium membership purchased successfully."};
  } catch (error) {
    console.log(error);
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
        const user = await User.findById(id);
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

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

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
        const  user = await User.findOne({ email });
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

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

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
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword;

        await user.save();

        return res.status(200).json({
            message:"Password reset Successfully",
            success:true
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

    const user = await User.findOne({ email });

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
