import { NextFunction, Request, Response } from "express";
import { ContactService } from "../services/contactService";


export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  addContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const contact = await this.contactService.addContact({
        userId: req.user._id,
        contactId: req.body.contactId,
        nickname: req.body.nickname,
      });

      res.status(201).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  };

  getContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const contacts = await this.contactService.getContact(req.user._id);
      res.status(200).json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  };
}
