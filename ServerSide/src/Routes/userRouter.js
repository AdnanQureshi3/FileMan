import express from "express";
import {register , login , deleteUser , verifyuser , isEmailExist , resetPassword , verifyOTPForPasswordreset} from '../Controllers/user_controller.js'
import { sendOtpForResetPassword , sendOtpForVerification } from "../Controllers/email_controller.js";
import isAuthanticated from "../middlewares/Auth.js";
const router = express.Router();


router.route('/register').post(register)
router.post('/login' , login);
router.delete('/delete', isAuthanticated, deleteUser);
router.post('/send-otpVerification',isAuthanticated, sendOtpForVerification);
router.post('/send-otpResetPassword', sendOtpForResetPassword);
router.post('/verify-otp', isAuthanticated, verifyuser);
router.post('/verify-otpForPasswordreset', verifyOTPForPasswordreset);
router.post('/isemailexist' , isEmailExist);
router.post('/resetpassword' , resetPassword);


export default router;