import express,{ Express,Request,Response } from "express";
import 'reflect-metadata'
import connectDB from "./config/db.";
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes";
import adminRoute from './routes/admin.routes'
import expertRoute from './routes/expert.routes'
import userRoute from './routes/user.routes'
import cookieParser from 'cookie-parser'
import http from 'http'
import cors from 'cors'
import { Server } from "socket.io";
import { initializeSocketHandler } from "./sockets/socketHandler";
const app=express()
const allowedOrigins = [
  "https://service-hub-snowy.vercel.app/", 
  "http://localhost:5173"       
];
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins, 
    credentials: true, 
   
};


const server= http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"]
    }
  });

  initializeSocketHandler(io);
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
server.listen(PORT,()=>{
    console.log("server running succesfully")
})