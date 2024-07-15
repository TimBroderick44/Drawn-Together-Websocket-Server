import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserHandlers } from "./controllers/userController";
import { registerRoomHandlers } from "./controllers/roomController";

const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Register socket event handlers
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  registerUserHandlers(io, socket);
  registerRoomHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
