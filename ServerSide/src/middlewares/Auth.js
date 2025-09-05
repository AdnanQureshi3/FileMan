import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthanticated = async(req , res, next) =>{
    try{
        const token = req.cookies.token;
        // console.log("Cookies:", req.cookies)

        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false,
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decode);
        if(!decode){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false,
            })
        }

        req.id = decode.id;
        next();
    }
    catch(error){
        console.log("Error in isAuthanticated middleware:", error);
    }
}

export default isAuthanticated;