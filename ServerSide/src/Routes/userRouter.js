import express from "express";
import {register , login , deleteUser , verifyuser} from '../Controllers/user_controller.js'
import { sendOtp } from "../Controllers/email_controller.js";
import isAuthanticated from "../middlewares/Auth.js";
const router = express.Router();


router.route('/register').post(register)
router.post('/login' , login);
router.delete('/delete', isAuthanticated, deleteUser);
router.get('/send-otp',isAuthanticated, sendOtp);
router.post('/verify-otp', isAuthanticated, verifyuser);


export default router;