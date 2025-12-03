import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ActiveSocketRepository {
    async connect(userId: string, socketId: string) {
        return await prisma.activeSocket.create({
            data: {
                userId,
                socketId
            }
        });
    }

    async disconnect(socketId: string) {
        return await prisma.activeSocket.deleteMany({
            where: { socketId }
        });
    }

    async isOnline(userId: string, senderId: string) {
        return await prisma.activeSocket.findMany({ where: { OR: [{userId}, {userId: senderId}] }})
    }
}

export default new ActiveSocketRepository()