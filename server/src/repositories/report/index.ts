import { Item } from "@/types/report";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReportRepository {
   async create(data: Item) {
      return prisma.item.create({ data })
   }

   async findFoundItems() {
      return prisma.item.findMany({ where: { type: 'FOUND' }})
   }

   async findLostItems() {
      return prisma.item.findMany({ where: { type: 'LOST' }})
   }

   async findItemById(id: string) {
      return prisma.item.findUnique({ where: { id }})
   }
}

export default new ReportRepository()