import express,{ Express,Request,Response } from "express";
import 'reflect-metadata'
import connectDB from "./config/db.";
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes";
import adminRoute from './routes/admin.routes'
import expertRoute from './routes/expert.routes'
import userRoute from './routes/user.routes'
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
app.use(express.urlencoded({ extended: true }));
connectDB() 

app.use('/',userRoute)
app.use('/auth',authRoutes)
app.use('/admin',adminRoute)
app.use('/expert',expertRoute)
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("server running succesfully")
})