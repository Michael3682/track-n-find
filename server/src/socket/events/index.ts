import MessageService from '@/socket/services/message'
import ActiveSocketService from '@/socket/services/active-socket'

import { Server, Socket } from "socket.io";


export default function registerSocketEvents(io: Server, socket: Socket) {
 
    socket.on("register", payload => ActiveSocketService.register(io, socket, payload))
    socket.on("send_message", payload => MessageService.sendMessage(io, socket, payload))
}
