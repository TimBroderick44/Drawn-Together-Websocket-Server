import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server";
import { registerSocketHandlers } from "./server";

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Register socket event handlers
registerSocketHandlers(io);

// Start the server and allow to specify the port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
