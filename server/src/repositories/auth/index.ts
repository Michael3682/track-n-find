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

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        })
    }

    async bindEmail(id: string, email: string) {
        return prisma.user.update({
            where: { id },
            data: { email },
        });
    }

    async setTheme(id: string, theme: "DARK" | "LIGHT") {
        return prisma.user.update({
            where: { id },
            data: {
                theme
            }
        })
    }
}

export default new AuthRepository()