import { Server } from "socket.io";
import { MessageService } from "../services/message.service";
import { MessageController } from "../controllers/message.controller";
import { MessageRepository } from "../repositories/MessageRepository";


export const initializeSocketHandler = (io: Server) => {
    const messageRepository = new MessageRepository();
    const messageService = new MessageService(messageRepository);
    const messageController = new MessageController(messageService);

    io.on("connection", (socket) => {
        messageController.handleConnection(io, socket);
    });
};