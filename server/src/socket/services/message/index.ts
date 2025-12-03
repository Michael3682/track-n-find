import { Server, Socket } from "socket.io";
import ChatRepository from "@/repositories/chat"
import ActiveSocketRepository from "@/repositories/active-socket"

class MessageService {
    
    async sendMessage(io: Server, socket: Socket, data: any) {
        console.log("Message recieve in BE:", data)
        
        const { text, conversationId, recepientId, senderId } = data

        const message = await ChatRepository.sendMessage(conversationId, senderId, text)

        const recepients = await ActiveSocketRepository.isOnline(recepientId, senderId)

        console.log(recepients)
        if(recepients) {
            recepients.forEach(recepient => {
                io.to(recepient.socketId).emit('recieve_message', message)
            })
        }
    }

}

export default new MessageService()