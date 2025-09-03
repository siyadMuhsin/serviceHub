import express, { Express, Request, Response } from "express";
import 'reflect-metadata'
import connectDB from "./config/dbs";
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
import Logger from './config/logger'
import { requestLogger } from "./middlewares/requestLogger";
// import '../src/jobs/deactivateExpiredSubscriptions'
import './jobs/deactivateExpiredSubscriptions'
// import limiting from "./utils/ratelimitting";

dotenv.config()
const app: Express = express()
const clientApi = process.env.CLIENT_API


// Replaced console.log with Logger
Logger.info(`Client id: ${clientApi}`)
app.use(requestLogger)
const corsOptions: cors.CorsOptions = {
    origin: clientApi, 
    credentials: true, 
    exposedHeaders: ['retry-after', 'ratelimit-limit', 'ratelimit-remaining', 'ratelimit-reset']
};

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: clientApi,
    methods: ["GET", "POST"]
  }
});
console.log('test1');

app.use(cors(corsOptions))
// app.use(limiting)
initializeSocketHandler(io);
app.use(cookieParser())
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
connectDB() 

app.use('/', userRoute)
app.use('/auth', authRoutes)
app.use('/admin', adminRoute)
app.use('/expert', expertRoute)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    Logger.info(`Server running successfully on port ${PORT}`)
})