import Redis from "ioredis";
import { ContactStatus, IContactDto } from "../types/types.contact";
import { User } from "../models/user.model";
import { Contact } from "../models/contact.model";
import { AppError } from "../utils/error";
import { config } from "../config/config";

export class ContactService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.redis);
  }

  async addContact(data: IContactDto) {
    try {
      const [user, contactUser] = await Promise.all([
        User.findById(data.userId),
        User.findById(data.contactId),
      ]);

      if (!user || !contactUser) {
        throw new AppError(404, "User not found");
      }

      const existingContact = await Contact.findOne({
        user: data.userId,
        contact: data.contactId,
      });

      if (!existingContact) {
        throw new AppError(404, "Contact already exists");
      }

      const contact = await Contact.create({
        user: data.userId,
        contact: data.contactId,
        nickname: data.nickname,
        status: ContactStatus.PENDING,
      });

      await this.invalidateContactCache(data.userId);

      return contact;
    } catch (error) {
      throw error;
    }
  }

  async getContact(userId: string) {
    try {
      const cacheContacts = await this.redis.get(`contacts:${userId}`);

      if (cacheContacts) return JSON.parse(cacheContacts);

      const contacts = await Contact.find({
        user: userId,
        status: ContactStatus.ACCEPTED,
      })
        .populate("contact", "name email")
        .lean();

      await this.redis.setex(
        `contact:${userId}`,
        3600,
        JSON.stringify(contacts)
      );

      return contacts;
    } catch (error) {
      throw error;
    }
  }

  private async invalidateContactCache(userId: string) {
    await this.redis.del(`contacts:${userId}`);
  }
}
