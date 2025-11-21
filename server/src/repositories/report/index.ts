import { Item } from "@/types/report";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReportRepository {
   async create(data: Item) {
      return prisma.item.create({ data })
   }
}

export default new ReportRepository()