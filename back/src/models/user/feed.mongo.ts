import { model, Schema } from "mongoose";
import { IFeed } from "../../interface/user.interface";

const schema = new Schema<IFeed>({
  userId: { type: Number, required: true },
  date: { type: Number, required: true },
  type: { type: Number, required: true },
  args: [
    {
      userId: Number,
      username: String,
      status: Number,
      project: String,
      projectId: Number,
    },
  ],
});
schema.index({ userId: 1, date: 1 });

export const Feed = model<IFeed>("Feed", schema);
