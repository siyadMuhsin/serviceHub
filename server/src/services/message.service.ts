import { inject, injectable } from "inversify";
import { MessageRepository } from "../repositories/MessageRepository";

import { IMessage } from "../models/message.model";
import { IMessageService } from "../core/interfaces/services/IMessageService";
import { TYPES } from "../di/types";
import { IMessageRepository } from "../core/interfaces/repositories/IMessageRepository";

@injectable()
export class MessageService implements IMessageService{
    constructor(
        @inject(TYPES.MessageRepository) private messageRepository: IMessageRepository
    ) {}

    async sendMessage(data: Partial<IMessage>): Promise<IMessage> {
        if (!data.sender || !data.receiver || !data.content) {
            throw new Error("Sender, receiver and content are required");
        }
        return this.messageRepository.createMessage(data);
    }

    async fetchUserMessages(userId: string): Promise<IMessage[]> {
        if (!userId) {
            throw new Error("User ID is required");
        }
        return this.messageRepository.getMessagesByUser(userId);
    }

    async fetchConversation(userId: string, otherUserId: string): Promise<IMessage[]> {
        if (!userId || !otherUserId) {
            throw new Error("Both user IDs are required");
        }
        return this.messageRepository.getConversation(userId, otherUserId);
    }
    async getChatUsers(expertId: string): Promise<{ success: boolean; message: string; users?: any[]; }> {
        try {
            const chatUsers  = await this.messageRepository.getChatUsers(expertId);
            console.log(chatUsers);
            const users = new Map();
            chatUsers.forEach((chat) => {
              const sender = chat.sender as any;
              const receiver = chat.receiver as any;
              const otherUser = sender._id.toString() === expertId ? receiver : sender;
              if (!users.has(otherUser._id.toString())) {
                users.set(otherUser._id.toString(), otherUser);
              }
            });
            return{success:false,message:'naon', users: Array.from(users.values())}
        } catch (error:any) {
            throw new Error(error.message)
        }
       
  
    }
}