import { IMessage } from "../../../models/message.model";

export interface IMessageService{
    sendMessage(data:Partial<IMessage>):Promise<IMessage>
    fetchUserMessages(userId:string):Promise<IMessage[]>
    fetchConversation(userId:string,otherUserId:string):Promise<IMessage[]>
    getChatUsers(userId:string):Promise<{
        success:boolean,
        message:string,
        users?:any[]
    }>
}