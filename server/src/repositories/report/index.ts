import { Item } from "@/types/report";
import { Claim, ItemType, PrismaClient, Return } from "@prisma/client";

const prisma = new PrismaClient();

class ReportRepository {
   async create(data: Item) {
      return prisma.item.create({ data })
   }

   async findItemsByUserId(userId: string, type: ItemType) {
      return prisma.item.findMany({ where: { associated_person: userId, type, isActive: true }, include: { author: { omit: { password: true }}, claims: true }})
   }

   async findItems({ isArchived = false } ) {
      return prisma.item.findMany({ include: { author: { omit: { password: true }}, claims: true }, where: { isActive: !isArchived }})
   }

   async findArchivedItemsByUserId(userId:string) {
      return prisma.item.findMany({ where: { associated_person: userId, isActive: false }, include: { author: { omit: { password: true }}, claims: true }})
   }

   async findItemById(id: string) {
      return prisma.item.findUnique({ where: { id }, include: {conversations: true}})
   }

   async update(id: string, data: Partial<Item>) {
      return prisma.item.update({
         where: { id },
         data
      })
   }

   async delete(id: string) {
      return prisma.item.delete({
         where: { id }
      })
   }

   async claim(data: Claim) {
      return prisma.claim.create({ data })
   }

   async returnItem(data: Return) {
      return prisma.return.create({ data })
   }

   async createTurnover(itemId: string) {
      return prisma.turnover.create({ data: { itemId }})
   }

   async confirmTurnover(itemId: string, proofOfTurnover: string) {
      return prisma.turnover.update({
         where: { itemId },
         data: {
            proofOfTurnover
         }
      })
   }

   async rejectTurnover(itemId: string) {
      return prisma.turnover.delete({
         where: { itemId }
      })
   }
}

export default new ReportRepository()