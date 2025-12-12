import { Logs, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class LogsRepository {
    async create(data: Logs) {
        return prisma.logs.create({ data })
    }
}

export default new LogsRepository()