import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(cors({
    origin: [process.env.Client_URL , "http://localhost:5173"],

    credentials:true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

//where dev is formate from 3 formates(dev , tiny , combined) 
export default app;
