import express,{ Express,Request,Response } from "express";
import connectDB from "./config/db.";
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes";
import adminRoute from './routes/adminRoutes/admin.route'
import expertRoute from './routes/expertRoutes/expert.routes'
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

app.use('/',authRoutes)
app.use('/admin',adminRoute)
app.use('/experts',expertRoute)
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("server running succesfully")
})