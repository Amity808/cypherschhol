const jwt = require('jsonwebtoken');

class WebSockets {
  constructor() {
    this.rooms = new Map();
    this.userConnections = new Map();
  }

  connection(ws) {
    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "TRANSACTIONS_CHANNEL") {
          const roomName = parsedMessage.channelType;
          this.joinRoom(ws, roomName, "Successfully joined locale WebSocket Channel");
        }

        if (parsedMessage.type === "PRIVATE_CHANNELS") {
          const { channelType, authToken } = parsedMessage;
          this.joinPrivateChannel(ws, channelType, authToken);
        }
      } catch (err) {
        console.log(err);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      this.leaveRooms(ws);
    });
  }

  joinRoom(ws, roomName, successMessage) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(ws);
    ws.send(JSON.stringify({ type: "TRANSACTIONS_CHANNEL", data: successMessage }));
  }

  joinPrivateChannel(ws, channelType, authToken) {
    try {
      const decoded = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
      const userChannel = `${channelType}-${decoded.aud}`;
      this.userConnections.set(userChannel, ws);
      ws.send(JSON.stringify({ type: "PRIVATE_CHANNELS", data: `Successfully joined private ${channelType} WebSocket Channel` }));
    } catch (error) {
      console.log(error);
    }
  }

  leaveRooms(ws) {
    this.rooms.forEach((roomSet, roomName) => {
      if (roomSet.has(ws)) {
        roomSet.delete(ws);
        if (roomSet.size === 0) {
          this.rooms.delete(roomName);
        }
      }
    });
  }
}

module.exports = new WebSockets();
