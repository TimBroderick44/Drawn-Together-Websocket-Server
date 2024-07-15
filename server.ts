import express from "express";
import { Server } from "socket.io";
import { registerUserHandlers } from "./controllers/userController";
import { registerRoomHandlers } from "./controllers/roomController";

const app = express();

// Create a new server
export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    registerUserHandlers(io, socket);
    registerRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default app;
