import { Feed } from "../models/user/feed.mongo";
import { Profile } from "../models/user/profile.model";
import { User } from "../models/user/user.model";
import { getUserSocket } from "../socket/bridge";

export async function changeStatus(
  userId: number,
  status: number
): Promise<void>;
export async function changeStatus(
  userId: number,
  username: string,
  status: number
): Promise<void>;

export async function changeStatus(
  userId: number,
  x: number | string,
  y?: number
): Promise<void> {
  var username = x;
  var status: number | undefined = y;
  if (y === undefined) {
    username = (await User.findOne({ where: { id: userId } }))!.username;
    status = <number>x;
  }
  console.log(`feed occured at ${userId}`);
  const date = Date.now();
  const profile = await Profile.findOne({
    where: { userId: userId },
  });
  const result = profile!.follower;
  for (const u of result) {
    const block = {
      userId: u,
      date: date,
      type: 20,
      args: [{ userId: userId, username: username }, { status: status }],
    };
    await new Feed(block).save();
    getUserSocket(u)?.emit("feed:notification", block);
  }
}

export async function follow(id: number, username: string, target: number) {
  const block = {
    userId: target,
    date: Date.now(),
    type: 30,
    args: [{ userId: id, username: username }],
  };
  await new Feed(block).save();
  getUserSocket(target)?.emit("feed:notification", block);
}

export async function project(
  type: 40 | 41 | 42,
  userId: number,
  projectId: number,
  projectName: string
) {
  const block = {
    userId: userId,
    date: Date.now(),
    type: type,
    args: [{ projectId: projectId, projectName: projectName }]
  };
  await new Feed(block).save();
  getUserSocket(userId)?.emit("feed:notification", block);
}

export async function projectLeader(
  type: 50,
  userId: number,
  username: string,
  projectId: number,
  projectName: string,
  leaderId: number
) {
  const block = {
    userId: leaderId,
    date: Date.now(),
    type: type,
    args: [
      { userId: userId, username: username },
      { projectId: projectId, projectName: projectName },
    ],
  };
  await new Feed(block).save();
  getUserSocket(leaderId)?.emit("feed:notification", block);
}

export async function changeProjectStatus(
  userId: number,
  projectId: number,
  projectName: string,
  projectStatus: string
) {
  const block = {
    userId: userId,
    date: Date.now(),
    type: 60,
    args: [
      { projectId: projectId, projectName: projectName },
      { projectStatus: projectStatus },
    ],
  };
  await new Feed(block).save();
  getUserSocket(userId)?.emit("feed:notification", block);
}

export async function replyoflounge(
  target: number,
  userId: number,
  username: string,
  loungeId: number,
  comment: string
) {
  const block = {
    userId: target,
    date: Date.now(),
    type: 70,
    args: [
      { userId: userId, username: username },
      { loungeId: loungeId, comment: comment },
    ],
  };
  await new Feed(block).save();
  getUserSocket(target)?.emit("feed:notification", block);
}