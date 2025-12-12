import LogsRepository from "@/repositories/logs"
import { Logs } from "@prisma/client"

class LogsService {
    async record({
        actorId,
        actorName,
        action,
        target,
        targetId,
        metaData
    }: Omit<Logs, "id" | "createdAt">) {

    }
}

export default new LogsService()















/*

    |  userId  |  name  |  email  |  role  |  date registered  |  

*/