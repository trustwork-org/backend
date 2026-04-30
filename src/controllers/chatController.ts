import { Request, Response, NextFunction } from 'express';
import * as chatService from '../services/chatService';

export const handleSendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sender, receiver, content } = req.body;
        const message = await chatService.sendMessage(sender, receiver, content);
        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

export const handleGetHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userA, userB } = req.params;
        const history = await chatService.getConversation(userA, userB);
        res.json(history);
    }
    catch (error) {
        next(error);
    }
};