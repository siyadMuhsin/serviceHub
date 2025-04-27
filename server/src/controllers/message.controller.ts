import { IMessage } from "../models/message.model";
import { MessageService } from "../services/message.service";
import { Server, Socket } from "socket.io";
import { AuthRequest } from "../types/User";
import { Response } from "express";
import { IMessageController } from "../core/interfaces/controllers/IMessageController";
import { HttpStatus } from "../types/httpStatus";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IMessageService } from "../core/interfaces/services/IMessageService";
import { IUserService } from "../core/interfaces/services/IUserService";
import { IExpertService } from "../core/interfaces/services/IExpertService";

@injectable()
// private readonly messageService: MessageService
export class MessageController implements IMessageController {
    constructor(
        @inject(TYPES.MessageService) private _messageService:IMessageService,
        @inject(TYPES.UserService) private _userService:IUserService,
        @inject(TYPES.ExpertService) private _expertService:IExpertService
) {}

handleConnection(io: Server, socket: Socket) {
    console.log(`New connection: ${socket.id}`);

    socket.on('join', (userId: string) => {
      if (!userId) {
        console.error('No userId provided for join');
        socket.emit('error', { message: 'Invalid userId' });
        return;
      }
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', async (data: Partial<IMessage>) => {
      try {
        if (
          !data.sender ||
          !data.receiver ||
          !data.content ||
          !data.senderModel ||
          !data.receiverModel
        ) {
          throw new Error('Missing required message fields');
        }
        if (!['User', 'Expert'].includes(data.senderModel) || !['User', 'Expert'].includes(data.receiverModel)) {
          throw new Error('Invalid senderModel or receiverModel');
        }
        let isBlocked:boolean|{ success: boolean; message: string } = false;
        if (data.senderModel === 'User') {
          isBlocked = await this._userService.checkBlocked((data.sender).toString());
        } else if (data.senderModel === 'Expert') {
          isBlocked = await this._expertService.checkBlocked((data.sender).toString());
        }
        if (isBlocked) {
          socket.emit('messageError', { error: 'You are blocked and cannot send messages.' });
          return;
        }
        const savedMessage = await this._messageService.sendMessage(data);
        io.to(data.receiver.toString()).emit('receiveMessage', savedMessage);
        io.to(data.sender.toString()).emit('receiveMessage', savedMessage);
        socket.emit('messageSent', savedMessage);
      } catch (error) {
        const err= error as Error
        console.error('Failed to send message:', error);
        socket.emit('messageError', {
          error: err instanceof Error ? err.message : 'Failed to send message',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  
    }
    async getConversation(req: AuthRequest,res:Response):Promise<void> {
        try {
          const senderId = req.expert ?req.expert.expertId:req.user.userId;
          const receiverId = req.params.receiverId;
          if (!senderId || !receiverId) {
           res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid request" });
          }
          const messages = await this._messageService.fetchConversation(senderId, receiverId);
          res.status(HttpStatus.OK).json(messages);
        } catch (error) {
          const err= error as Error
          console.error("Error fetching conversation:",err);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message||"Failed to fetch conversation" });
        }
      }
      async getChatUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const expertId = req?.expert?.expertId; 
            const users = await this._messageService.getChatUsers(expertId);
            res.status(HttpStatus.OK).json(users);
          } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:err.message|| 'Failed to fetch chat users', error });
          }
          
      }
}