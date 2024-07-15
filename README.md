# Drawn Together (WebSocket Server)

### NOTE:
*This is the Websocket Server for my 'Drawn Together' project and requires access to the [Frontend](https://github.com/TimBroderick44/Drawn-Together-Frontend) and the [Backend](https://github.com/TimBroderick44/Drawn-Together-Backend).

The WebSocket server handles real-time communication between clients, allowing users to draw together in real time. It manages user connections, room states, and drawing events.

## Technologies Used

- Server: Node.js, Express
- WebSocket: socket.io

## Highlights

- **Real-Time Communication**: Manages real-time drawing and interactions using WebSocket.
- **User and Room Management**: Efficiently handles user connections, disconnections, and room states.

## Build Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/drawn-together-server.git
   cd drawn-together-server
    ```

2. **Install the dependencies**:
    ```bash
      npm install
    ```

3. **Start the server**:
    ```bash
      npm run server
    ```

4. **Put it all together**:
   - Ensure that the [Frontend](https://github.com/TimBroderick44/Drawn-Together-Frontend) and the [Backend](https://github.com/TimBroderick44/Drawn-Together-Backend) are running and access via:
    ```bash
      npm run dev (after setting up the frontend)
    ```

## Lessons Learnt:

- **WebSocket**: Learned how to use WebSocket for real-time communication. Specifically, used socket.io and learned how to manage connections, rooms, and events.In future would like to do it without the use of socket.io.

## What I still need to do:

### Gamificaiton of the project:

-   [ ] Allow users to take turns drawing and guessing various words. 
-   [ ] Implement a scoring system.
-   [ ] Add a timer for each turn.
-   [ ] Add a chat feature.
  
## Thank You!

Thank you for taking the time to look at this project. I really hope you enjoy it.
Feel free to reach out and ask any questions.

[Tim Broderick]

