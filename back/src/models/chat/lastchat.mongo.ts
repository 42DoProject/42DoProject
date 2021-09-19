import { model, Schema } from "mongoose";
import { ILastChat } from "../../interface/chat.interface";

const schema = new Schema<ILastChat>({
  uuid: { type: String, required: true },
  userId: { type: Number, required: true },
  availableDate: { type: Number, required: true },
  date: { type: Number, required: true },
});
schema.index({ uuid: 1 });

export const LastChat = model<ILastChat>("LastChat", schema);
