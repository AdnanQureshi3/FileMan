import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthanticated = async(req , res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                msg:"User not Authenticated",
                success:false,

            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                msg:"User not Authenticated",
                success:false,
            })
        }

        req.id = decode.userId;
        next();
    }
    catch(error){
        console.log("Error in isAuthanticated middleware:", error);
    }
}

export default isAuthanticated;