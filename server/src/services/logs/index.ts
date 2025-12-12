import LogsRepository from "@/repositories/logs"
import AuthRepository from "@/repositories/auth"
import { Logs } from "@/types/logs"

class LogsService {
    async record({
        actorId,
        action,
        target,
        targetId,
        metaData
    }: Omit<Logs, "actorName">) {
        const user = await AuthRepository.findById(actorId)

        if(!user) return null

        return await LogsRepository.create({
            actorId,
            actorName: user.name,
            action,
            target,
            targetId,
            metaData
        })
    }

    async getLogs({ offset, limit }: { offset: number, limit: number }) {
        const logs = await LogsRepository.find({ offset, limit })
        const total = await LogsRepository.countLogs()

        return {
            logs,
            total,
            totalPages: Math.ceil(total/limit)
        }
    }
}

export default new LogsService()