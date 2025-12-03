import { Server, Socket } from "socket.io"
import ActiveSocketRepository from "@/repositories/active-socket"

class ActiveSocketService {
    async register(io: Server, socket: Socket, data: any) {
        const { userId } = data

        await ActiveSocketRepository.connect(userId, socket.id)
    }
    
}

export default new ActiveSocketService()