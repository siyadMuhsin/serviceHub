import { injectable } from "inversify";
import { MessageRepository } from "../repositories/MessageRepository";

import { IMessage } from "../models/message.model";

@injectable()
export class MessageService {
    constructor(private readonly messageRepository: MessageRepository) {}

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
}