import { Server, Socket } from "socket.io";
import { addUser, addInvite, removeInvite, clearInvitesForUsers, updateRoom } from "../utils/dataUtils";
import { users, userStates, invites } from "../data";

export const registerUserHandlers = (io: Server, socket: Socket) => {
  // On login, the server will add the user to the list of users and emit "updateUserList" and "updateUserStates" to all users.
  socket.on("login", (username) => {
    addUser(username, socket.id);
    io.emit("updateUserList", Object.keys(users));
    io.emit("updateUserStates", userStates);
  });

  // When an invite is sent, the server will add the invite to the list of invites and emit "updateInvites" to all users.
  socket.on("invite", (invitee) => {
    const inviteeSocketId = users[invitee];
    const inviterName = Object.keys(users).find(key => users[key] === socket.id);

    if (inviteeSocketId && inviterName) {
      addInvite(inviterName, invitee);
      io.emit("updateInvites", invites);
      io.to(inviteeSocketId).emit("invite", {
        inviterSocketId: socket.id,
        inviterName: inviterName,
      });
    }
  });

  // When an invite is cancelled, the server will remove the invite from the list of invites and emit "updateInvites" to all users.
  socket.on("cancel-invite", (invitee) => {
    const inviterName = Object.keys(users).find(key => users[key] === socket.id);
    if (inviterName) {
      removeInvite(inviterName, invitee);
      io.emit("updateInvites", invites);
      io.to(users[invitee]).emit("invite-cancelled", { inviterName });
    }
  });

  // When an invite is accepted, the server will create a room for the users and emit "start-drawing-session" to the room.
  socket.on("accept-invite", (inviterSocketId) => {
    const inviterName = Object.keys(users).find(key => users[key] === inviterSocketId);
    const inviteeName = Object.keys(users).find(key => users[key] === socket.id);

    if (inviterName && inviteeName) {
      const roomName = `${socket.id}-${inviterSocketId}`;
      updateRoom(roomName, socket.id, "join");

      userStates[inviterName] = "in-game";
      userStates[inviteeName] = "in-game";

      clearInvitesForUsers([inviterName, inviteeName]);

      io.emit("updateInvites", invites);
      io.emit("updateUserStates", userStates);

      io.to(inviterSocketId).emit("invite-accepted", roomName);
      io.to(roomName).emit("start-drawing-session", roomName);
    }
  });

  // When an invite is rejected, the server will remove the invite from the list of invites and emit "updateInvites" to all users.
  socket.on("reject-invite", ({ inviterSocketId, inviteeName }) => {
    const inviterName = Object.keys(users).find(key => users[key] === inviterSocketId);
    if (inviterName) {
      removeInvite(inviterName, inviteeName);
      io.emit("updateInvites", invites);
      io.to(inviterSocketId).emit("invite-rejected", { inviteeName });
    }
  });
};
