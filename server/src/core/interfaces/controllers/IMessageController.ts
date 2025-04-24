import { Server, Socket } from "socket.io";
import { AuthRequest } from "../../../types/User";
import { Response } from "express";

export interface IMessageController{
    handleConnection(io: Server, socket: Socket):void
    getConversation(req:AuthRequest,res:Response):Promise<void>
    getChatUsers(req:AuthRequest,res:Response):Promise<void>
}