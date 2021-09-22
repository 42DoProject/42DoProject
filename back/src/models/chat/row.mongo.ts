import { model, Schema } from "mongoose";
import { IChatRow } from "../../interface/chat.interface";

const schema = new Schema<IChatRow>({
  uuid: { type: String, required: true },
  date: { type: Number, required: true },
  userId: { type: Number, required: true },
  message: { type: String, required: true },
});
schema.index({ uuid: 1, date: 1 });

export const ChatRow = model<IChatRow>("Chat", schema);
