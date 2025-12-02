import { Server, Socket } from "socket.io";
import ChatRepository from "@/repositories/chat"

class MessageService {
    async sendMessage(io: Server, socket: Socket, data: any) {
        console.log("Message recieve in BE:", data)
    }

    async newConversation(io: Server, socket: Socket, data: any) {
        console.log("Test", data)
        const convo = await ChatRepository.findOrCreateConversation(data)
        console.log(convo)
        
        socket.emit("conversation_found", convo)
    }
}

export default new MessageService()