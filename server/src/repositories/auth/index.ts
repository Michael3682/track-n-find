import { User } from "@/types/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthRepository {
    async create(data: User) {
        return prisma.user.create({ data });
    }

    async find({ offset, limit }: { offset: number, limit: number}) {
        return prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            where: {
                NOT: {
                    id: '00000000'
                }
            }
        })
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

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
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
    
    async setRole(id: string, role: "USER" | "MODERATOR" ) {
        return prisma.user.update({
            where: { id },
            data: {
                role
            }
        })
    }

    async updatePassword(id: string, password: string) {
        return prisma.user.update({
            where: { id },
            data: {
                password
            }
        })
    }
}

export default new AuthRepository()