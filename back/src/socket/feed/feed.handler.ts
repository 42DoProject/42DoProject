import { Server, Socket } from "socket.io";
import { Profile } from "../../models/user/profile.model";

export const readAt = async (io: Server, socket: Socket, payload: any) => {
  await Profile.update(
    { feed: Date.now() },
    { where: { userId: socket.data.user } }
  );
};
