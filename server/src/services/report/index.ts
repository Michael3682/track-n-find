import ReportRepository from "@/repositories/report";
import { Item } from "@/types/report";
import { Claim, ItemStatus, ItemType } from "@prisma/client";
import { any } from "joi";

class ReportService {
  async addFoundItem(data: {
    itemName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    location: string;
    attachments?: string[];
    description: string;
    userId: string;
  }) {
    const isoDate = data.date.split("T")[0];
    const dateTime = new Date(`${isoDate}T${data.time}:00`);

    return ReportRepository.create({
      name: data.itemName,
      date_time: dateTime,
      location: data.location,
      attachments: data.attachments,
      description: data.description,
      status: ItemStatus.UNCLAIMED,
      type: ItemType.FOUND,
      associated_person: data.userId,
      category: "",
    });
  }

  async addLostItem(data: {
    itemName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    location: string;
    attachments?: string[];
    description: string;
    userId: string;
  }) {
    const isoDate = data.date.split("T")[0];
    const dateTime = new Date(`${isoDate}T${data.time}:00`);

    return ReportRepository.create({
      name: data.itemName,
      date_time: dateTime,
      location: data.location,
      attachments: data.attachments,
      description: data.description,
      status: ItemStatus.UNCLAIMED,
      type: ItemType.LOST,
      associated_person: data.userId,
      category: "",
    });
  }

  async getUserFoundItems(userId: string) {
    return ReportRepository.findItemsByUserId(userId, "FOUND")
  }

  async getUserLostItems(userId: string) {
    return ReportRepository.findItemsByUserId(userId, "LOST")
  }

  async getItems() {
    return ReportRepository.findItems({ isArchived: false })
  }

  async getArchivedItems() {
    return ReportRepository.findItems({ isArchived: true })
  }
  
  async getUserArchivedItems(userId: string) {
    return ReportRepository.findArchivedItemsByUserId(userId)
  }

  async getItem(id: string) {
    return ReportRepository.findItemById(id)
  }

  async updateItem(id: string, data: Partial<Item>) {
    return ReportRepository.update(id, data)
  }

  async deleteItem(id: string) {
    return ReportRepository.delete(id)
  }

  async archiveItem(id: string) {
    return ReportRepository.update(id, {
      isActive: false
    })
  }

  async restoreItem(id: string) {
    return ReportRepository.update(id, {
      isActive: true
    })
  }

  async reportClaim(
    data : any
  ) {
    return ReportRepository.claim(data)
  }

  async reportReturn(data: any) {
    return ReportRepository.returnItem(data)
  }
}

export default new ReportService();
