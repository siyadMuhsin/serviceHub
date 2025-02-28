import express,{ Express,Request,Response } from "express";
import connectDB from "./config/db.";
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes";
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
   
};
app.use(cors(corsOptions))
app.use(cookieParser())
dotenv.config()
app.use(express.json())
connectDB() 

app.use('/',authRoutes)
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("server running succesfully")
})