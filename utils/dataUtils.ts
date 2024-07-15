import { Server } from "socket.io";
import { users, userStates, invites, rooms } from "../data";

// addUser is used to add a user to the list of users and set their state to "online".
export const addUser = (username: string, socketId: string) => {
  users[username] = socketId;
  userStates[username] = "online";
  invites[username] = [];
};

// removeUser is used to remove a user from the list of users and notify the user's partner if they are in a room.
export const removeUser = (socketId: string, io: Server) => {
  const username = Object.keys(users).find(key => users[key] === socketId);
  if (username) {
    const roomName = Object.keys(rooms).find(room => rooms[room].includes(socketId));
    if (roomName) {
      const otherUserSocketId = rooms[roomName].find(id => id !== socketId);
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit("partner-disconnected");
      }
      delete rooms[roomName];
    }
    delete users[username];
    delete userStates[username];
    Object.keys(invites).forEach(key => {
      invites[key] = invites[key].filter(invitee => invitee !== username);
    });
    io.emit("updateUserList", Object.keys(users));
    io.emit("updateUserStates", userStates);
    io.emit("updateInvites", invites);
  }
};

// clearRoom is used to delete a room and notify all users in the room that their partner has left.
export const clearRoom = (roomName: string, io: Server) => {
  const usersInRoom = rooms[roomName];
  usersInRoom.forEach(socketId => {
    io.to(socketId).emit("partner-left");
  });
  delete rooms[roomName];
};

// addInvite is used to add a user to the list of invites for a user.
export const addInvite = (inviterName: string, invitee: string) => {
  // If the user is not already invited, the user is added to the list of invites.
  if (!invites[inviterName].includes(invitee)) {
    invites[inviterName].push(invitee);
  }
};

// removeInvite is used to remove a user from the list of invites for a user.
export const removeInvite = (inviterName: string, invitee: string) => {
  invites[inviterName] = invites[inviterName].filter(user => user !== invitee);
};

// clearInvitesForUsers is used to remove all invites for a list of users.
// e.g. when a user logs out, all invites for that user are removed.
export const clearInvitesForUsers = (usersToClear: string[]) => {
  usersToClear.forEach(user => {
    invites[user] = [];
  });

  // Remove the users to clear from the list of invites for all other users.
  // e.g. if a user joins a room, all invites for that user are removed.
  Object.keys(invites).forEach(user => {
    invites[user] = invites[user].filter(invitee => !usersToClear.includes(invitee));
  });
};

// updateRoom is used to add or remove a user from a room.
// If the status is "join", the user is added to the room.
// If the status is "leave", the user is removed from the room.
// If the room is empty after removing the user, the room is deleted.
export const updateRoom = (roomName: string, socketId: string, status: "join" | "leave") => {
  if (status === "join") {
    rooms[roomName] = rooms[roomName] ? [...rooms[roomName], socketId] : [socketId];
  } else {
    rooms[roomName] = rooms[roomName].filter(id => id !== socketId);
    if (rooms[roomName].length === 0) {
      delete rooms[roomName];
    }
  }
};