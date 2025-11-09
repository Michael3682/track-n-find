import { User } from "@/types/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthRepository {
    async create(data: User) {
        return prisma.user.create({ data });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id }
        })
    }
}

export default new AuthRepository()