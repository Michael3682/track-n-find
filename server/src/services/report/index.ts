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
    // data.date is always a string: "2025-11-21" OR "2025-11-21T00:00:00.000Z"
    const isoDate = data.date.split("T")[0]; // extract YYYY-MM-DD

    // data.time must be "HH:mm"
    const dateTime = new Date(`${isoDate}T${data.time}:00`);

    // console.log("RAW BODY:", req.body);
    console.log("JOI VALUE DATE:", data.date);
    console.log("JOI VALUE TIME:", data.time);
    console.log("COMBINED STRING:", `${data.date}T${data.time}:00`);

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
}

export default new ReportService();
