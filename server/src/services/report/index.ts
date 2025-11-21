import ReportRepository from "@/repositories/report";
import { ItemStatus, ItemType } from "@prisma/client";
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

  async getFoundItems() {
    return ReportRepository.findFoundItems()
  }
}

export default new ReportService();
