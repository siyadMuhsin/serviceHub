import { IMessage } from "../models/message.model";
import { MessageService } from "../services/message.service";
import { Server, Socket } from "socket.io";

export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    handleConnection(io: Server, socket: Socket) {
        console.log(`New connection: ${socket.id}`);

        socket.on("join", (userId: string) => {
            if (!userId) {
                console.error("No userId provided for join");
                return;
            }
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on("sendMessage", async (data: Partial<IMessage>) => {
            try {
                if (!data.sender || !data.receiver || !data.content) {
                    throw new Error("Invalid message data");
                }

                const savedMessage = await this.messageService.sendMessage(data);
                io.to(data.receiver.toString()).emit("receiveMessage", savedMessage);
                
                // Also send back to sender for UI update if needed
                socket.emit("messageSent", savedMessage);
            } catch (error) {
                console.error("Failed to send message:", error);
                socket.emit("messageError", {
                    error: error instanceof Error ? error.message : "Failed to send message"
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    }
}