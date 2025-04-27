import { IMessageRepository } from "../core/interfaces/repositories/IMessageRepository";
import Message, { IMessage } from "../models/message.model";

export class MessageRepository implements IMessageRepository{
    async createMessage(data: Partial<IMessage>): Promise<IMessage> {
        try {
            return await Message.create(data);
        } catch (error) {
            const err= error as Error
            throw new Error(`Failed to create message: ${err instanceof Error ? err.message : String(error)}`);
        }
    }

    async getMessagesByUser(userId: string): Promise<IMessage[]> {
        try {
            return await Message.find({
                $or: [{ sender: userId }, { receiver: userId }]
            }).sort({ timestamp: 1 }).exec();
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getConversation(userId: string, otherUserId: string): Promise<IMessage[]> {
        try {
            return await Message.find({
                $or: [
                    { sender: userId, receiver: otherUserId },
                    { sender: otherUserId, receiver: userId }
                ]
            }).sort({ timestamp: 1 }).exec();
        } catch (error) {
            throw new Error(`Failed to fetch conversation: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getChatUsers(expertId: string): Promise<IMessage[]> {
       return  await Message.find({
            $or: [{ sender: expertId }, { receiver: expertId }],
          }).populate('sender', 'name profile_image role').populate('receiver.userId','name profile_image role')
    }
}