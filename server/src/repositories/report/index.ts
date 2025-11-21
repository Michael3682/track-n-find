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
}

export default new ReportRepository()