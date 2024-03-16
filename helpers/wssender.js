import { WebSocket } from 'ws'


const socketMessengers = {
    sendWebsocketMessage: ((roomName, wsType, data) => {
        if(global.rooms.has(roomName)) {
            global.rooms.get(roomName).forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    const message = JSON.stringify({
                        type: wsType,
                        data: data
                    })
                    client.send(message)
                }
            });
        }
    }),

    sendPersonalWebscoketMessage : ((channelType, userId, data) => {
        if (channelType && data) {
            const socket = global.userConnections.get([channelType, userId].join('-'))
            if (socket) {
                const message = JSON.stringify({ type: wsType, data: data })
                socket.send(message)
            } else {
                console.log("USer websocket connection not found");
            }
        }
    })
}


export default socketMessengers;