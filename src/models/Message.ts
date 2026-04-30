import { Schema, model, Document} from 'mongoose';

export interface Imessage extends Document {
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<Imessage>(
    {
        sender: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        receiver: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// This index makes fetching history between two users fast
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export const Message = model<Imessage>('Message', messageSchema);