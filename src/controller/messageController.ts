import { Request, Response } from 'express';
import MessageService from '../services/MessageService';

interface CustomRequest extends Request {
  decode: {
    id: string;
  };
}

export const getAllMessages = async (req: CustomRequest, res: Response) => {
  const { partner_id } = req.params;
  const { id } = req.decode;
  const messages = await MessageService.getAllMessages(id, partner_id);
  return res.json(messages);
};
