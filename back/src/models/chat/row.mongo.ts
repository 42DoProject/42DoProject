import { model, Schema } from "mongoose";
import { IChatRow } from "../../interface/chat.interface";

const schema = new Schema<IChatRow>({
  uid: { type: String, required: true },
  date: { type: Number, required: true },
  userId: { type: Number, required: true },
  content: { type: String, required: true },
});
schema.index({ uid: 1, date: 1 });

export const ChatRow = model<IChatRow>("Chat", schema);
