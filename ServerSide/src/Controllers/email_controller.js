import nodemailer from "nodemailer";
import User from "../models/user_Model.js";

export const sendOtp = async (req , res) => {
    try{
        const savedUser = await User.findOne({ _id: req.id });
        if (!savedUser) {
            return res.status(404).json({ message: "User not found" });
        }
       
        const email = savedUser.email;
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
       savedUser.otp = otp.toString();

        savedUser.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
        await savedUser.save();

        // Send OTP email
        await transporter.sendMail({
    from: `"FileMan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "FileMan | Email Verification",
    html: `
    <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="background:#4f46e5; padding:20px; text-align:center;">
          <h1 style="color:#fff; font-size:36px; margin:0;">FileMan</h1>
          <p style="color:#dbeafe; font-size:16px; margin:5px 0 0;">Share files easily, securely, and instantly.</p>
        </div>
        
        <div style="padding:30px; text-align:center;">
          <h2 style="color:#111827; margin-bottom:10px;">Verify Your Email</h2>
          <p style="color:#374151; font-size:15px; margin-bottom:20px;">
            Please use the OTP code below to complete your verification for <b>FileMan</b>.
          </p>

          <div style="font-size:28px; font-weight:bold; color:#4f46e5; background:#f3f4f6; display:inline-block; padding:15px 25px; border-radius:8px; margin:20px 0;">
            ${otp}
          </div>
          <p style="font-size:14px; color:#666; margin-top:10px;">This OTP is valid for 15 minutes. Please do not share it with anyone.</p>


          <p style="color:#6b7280; font-size:13px; margin-top:20px;">
            This code will expire in 10 minutes. If you didn’t request this, you can ignore this email.
          </p>
        </div>
        
        <div style="background:#f9fafb; padding:15px; text-align:center; border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af; font-size:12px; margin:0;">&copy; ${new Date().getFullYear()} FileMan. All rights reserved.</p>
        </div>
      </div>
    </div>
    `
});


        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch(error){
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}