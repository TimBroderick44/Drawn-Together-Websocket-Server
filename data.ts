// These are the data structures that will be used to store the state of the server

export const users: { [username: string]: string } = {}; // username: socketId
export const userStates: { [username: string]: string } = {}; // username: 'online' or 'in-game'
export const rooms: { [roomName: string]: string[] } = {}; // roomName: [user1_socketId, user2_socketId]
export const invites: { [username: string]: string[] } = {}; // username: [invited usernames]
