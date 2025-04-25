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

@injectable()
// private readonly messageService: MessageService
export class MessageController implements IMessageController {
    constructor(
        @inject(TYPES.MessageService) private messageService:IMessageService
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

        const savedMessage = await this.messageService.sendMessage(data);
        console.log('Saved message:', savedMessage);

        // Emit to both sender and receiver rooms
        io.to(data.receiver.toString()).emit('receiveMessage', savedMessage);
        io.to(data.sender.toString()).emit('receiveMessage', savedMessage);

        // Confirm to sender
        socket.emit('messageSent', savedMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
        socket.emit('messageError', {
          error: error instanceof Error ? error.message : 'Failed to send message',
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
          const messages = await this.messageService.fetchConversation(senderId, receiverId);
          res.status(HttpStatus.OK).json(messages);
        } catch (error) {
          console.error("Error fetching conversation:", error);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch conversation" });
        }
      }
      async getChatUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const expertId = req?.expert?.expertId; 
            const users = await this.messageService.getChatUsers(expertId);
            res.status(HttpStatus.OK).json(users);
          } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch chat users', error });
          }
          
      }
}