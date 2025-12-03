import { Server, Socket } from "socket.io";
import ChatRepository from "@/repositories/chat"
import ActiveSocketRepository from "@/repositories/active-socket"

class MessageService {
    
    async sendMessage(io: Server, socket: Socket, data: any) {
        console.log("Message recieve in BE:", data)
        
        const { text, conversationId, recepientId, senderId } = data

        const message = await ChatRepository.sendMessage(conversationId, senderId, text)
        const recepients = await ActiveSocketRepository.isOnline(recepientId, senderId)
        
        if(recepients) {
            recepients.forEach(async recepient => {
                const conversation = await ChatRepository.getUserConversations(recepient.userId)

                io.to(recepient.socketId).emit('recieve_message', message)
                io.to(recepient.socketId).emit('new_message', conversation)
            })
        }
    }

}

export default new MessageService()