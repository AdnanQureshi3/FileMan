import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ConnectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected successfully: ${connect.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection failed" , error);
    }
}
export default ConnectDB;