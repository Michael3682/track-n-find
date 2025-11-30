import MessageService from '@/socket/services/message'

import { Server, Socket } from "socket.io";


export default function registerSocketEvents(io: Server, socket: Socket) {
 
    socket.on("send_message", payload => MessageService.sendMessage(io, socket, payload));
    socket.on("new_conversation", payload => MessageService.newConversation(io, socket, payload))
}
