import { Server } from "socket.io";
import { MessageService } from "../services/message.service";
import { MessageController } from "../controllers/message.controller";
import { MessageRepository } from "../repositories/MessageRepository";
import container from "../di/container";
import { IMessageController } from "../core/interfaces/controllers/IMessageController";
import { TYPES } from "../di/types";


export const initializeSocketHandler = (io: Server) => {
    const messageController = container.get<IMessageController>(TYPES.MessageController);

    io.on("connection", (socket) => {
        messageController.handleConnection(io, socket);
    });
};