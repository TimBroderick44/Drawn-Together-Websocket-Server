import { Server, Socket } from "socket.io";
import { clearRoom, removeUser, updateRoom } from "../utils/dataUtils";
import { userStates, users, rooms } from "../data";
import { DrawLine } from "../types/typing";

// io.to is used to emit events to all clients in the room.
// socket is used to emit events to the client that triggered the event.

// io.to.emit VS socket.to.emit
// io is emitted to all users in the room (e.g clearing the canvas)
// socket is emitted to all users in the room except the user that triggered the event (e.g. drawing a line)

export const registerRoomHandlers = (io: Server, socket: Socket) => {

  // When "join-room" is used on the frontend, the server will check if the room exists and if the user is authorized to join the room. 
  // If the user is authorized, the server will join the user to the room and emit "start-drawing-session" to the room.
  socket.on("join-room", (roomName) => {
    // If a user tries to join a room via the URL without being authorized, the server will emit "unauthorized-access" to the user.
    // TODO: However, all users will be unauthorized as when the server restarts, a different socket id is assigned to the user.

    if (rooms[roomName] && rooms[roomName].includes(socket.id)) {
      socket.join(roomName);
      io.to(roomName).emit("start-drawing-session", roomName);
    } else {
      io.to(socket.id).emit("unauthorized-access");
    }
  });

  socket.on("draw-line", ({ prevPoint, currentPoint, color, roomName }: DrawLine & { roomName: string }) => {
    socket.to(roomName).emit("draw-line", { prevPoint, currentPoint, color });
  });

  socket.on("clear", (roomName) => {
    io.to(roomName).emit("clear");
  });

  socket.on("leave-room", (roomName) => {
    socket.leave(roomName);
    updateRoom(roomName, socket.id, "leave");
    // If the user is the last user in the room, the server will clear the room.
    const otherUser = rooms[roomName]?.find(id => id !== socket.id);
    if (otherUser) {
      // partner-left returns the user to the waiting room with a notification.
      io.to(otherUser).emit("partner-left");
    }
    // userName is used to update the user state to "online" when the user leaves the room.
    const userName = Object.keys(users).find(key => users[key] === socket.id);
    if (userName) {
      userStates[userName] = "online";
      io.emit("updateUserStates", userStates);
    }
    // If the room is empty, the server will clear the room.
    if (!rooms[roomName]) {
      clearRoom(roomName, io);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id, io);
  });
};
