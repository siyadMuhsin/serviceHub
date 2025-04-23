import Message, { IMessage } from "../models/message.model";

export class MessageRepository {
    async createMessage(data: Partial<IMessage>): Promise<IMessage> {
        try {
            return await Message.create(data);
        } catch (error) {
            throw new Error(`Failed to create message: ${error instanceof Error ? error.message : String(error)}`);
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
}