import { Server } from "socket.io";
import container from "../di/container";
import { IMessageController } from "../core/interfaces/controllers/IMessageController";
import { TYPES } from "../di/types";


export const initializeSocketHandler = (io: Server) => {
    const messageController = container.get<IMessageController>(TYPES.MessageController);

    io.on("connection", (socket) => {
        messageController.handleConnection(io, socket);
    });
};