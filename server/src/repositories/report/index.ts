import { Item } from "@/types/report";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReportRepository {
   async create(data: Item) {
      return prisma.item.create({ data })
   }

   async findItems() {
      return prisma.item.findMany()
   }

   async findItemById(id: string) {
      return prisma.item.findUnique({ where: { id }})
   }
}

export default new ReportRepository()