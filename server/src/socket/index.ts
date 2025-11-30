import http from "http";
import { Server } from "socket.io";
import { Express } from "express";
import registerSocketEvents from "./events";

let io: Server;

export const initializeSocket = (app: Express) => {
    const httpServer = http.createServer(app)
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // register all events
        registerSocketEvents(io, socket);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return httpServer;
};

// export it so other services can emit events
export const getIO = () => io;
