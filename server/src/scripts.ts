import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createSuperAdmin() {
    const SUPER_ADMIN_EMAIL = "superadmin@tnf.com"
    const SUPER_ADMIN_PASSWORD = "Password123%"

    const existing = await prisma.user.findUnique({
        where: { email: SUPER_ADMIN_EMAIL },
    });

    if (existing) {
        console.log("Super admin already exists");
        return existing;
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    const superAdmin = await prisma.user.create({
        data: {
            id: '00000000',
            name: "Super Admin",
            email: SUPER_ADMIN_EMAIL,
            role: "ADMIN",
            password: hashedPassword,
        },
    });

    console.log("Super admin created:", superAdmin.id);
}