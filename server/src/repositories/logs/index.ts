import { Logs } from "@/types/logs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class LogsRepository {
    async create(data: Logs) {
        return prisma.logs.create({ data })
    }

    async find({ offset, limit }: { offset: number, limit: number }) {
        return prisma.logs.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    async countLogs() {
        return prisma.logs.count()
    }
}

export default new LogsRepository()