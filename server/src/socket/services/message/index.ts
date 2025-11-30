import { Server, Socket } from "socket.io";


class MessageService {
    async sendMessage(io: Server, socket: Socket, data: any) {
        console.log("Message recieve in BE:", data)
    }

    async newConversation(io: Server, socket: Socket, data: any) {
        console.log("Test", data)
    }
}

export default new MessageService()