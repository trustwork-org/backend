import {Message} from '../models/Message';

export const sendMessage = async (sender: string, receiver: string, content: string) => {
    return await Message.create({
        sender: sender.toLowerCase(),
        content,
        receiver: receiver.toLowerCase(),
    });
};

export const getConversation = async (userA: string, userB: string) => {
    const addrA = userA.toLowerCase();
    const addrB = userB.toLowerCase();

    return await Message.find({
        $or: [
            { sender: addrA, receiver: addrB },
            { sender: addrB, receiver: addrA },
        ],
    }).sort({ createdAt: 1});
};