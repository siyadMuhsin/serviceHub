import { IMessage } from "../../../models/message.model"

export interface IMessageRepository{
    createMessage(data: Partial<IMessage>): Promise<IMessage>

    getMessagesByUser(userId: string): Promise<IMessage[]> 

    getConversation(userId: string, otherUserId: string): Promise<IMessage[]> 
    getChatUsers(expertId:string):Promise<IMessage[]>
}