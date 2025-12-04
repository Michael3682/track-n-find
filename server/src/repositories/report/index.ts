import { Item } from "@/types/report";
import { ItemType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReportRepository {
   async create(data: Item) {
      return prisma.item.create({ data })
   }

   async findItemsByUserId(userId: string, type: ItemType) {
      return prisma.item.findMany({ where: { associated_person: userId, type }})
   }

   async findItems() {
      return prisma.item.findMany({ include: { author: { omit: { password: true }} }})
   }

   async findItemById(id: string) {
      return prisma.item.findUnique({ where: { id }})
   }

   async update(id: string, data: Partial<Item>) {
      return prisma.item.update({
         where: { id },
         data
      })
   }
}

export default new ReportRepository()