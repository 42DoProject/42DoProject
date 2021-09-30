import { model, Schema } from "mongoose";
import { IFeed } from "../../interface/user.interface";

const schema = new Schema<IFeed>({
  userId: { type: Number, required: true },
  date: { type: Number, required: true },
  message: { type: String, required: true },
  args: [{ type: Array }],
});
schema.index({ userId: 1, date: 1 });

export const Feed = model<IFeed>("Feed", schema);
