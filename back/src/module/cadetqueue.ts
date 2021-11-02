import { off } from "process";
import { Profile } from "../models/user/profile.model";
import { User } from "../models/user/user.model";

const queue: {
  id: number;
  username: string;
  profileImage: string;
  blurImage: string;
  position: number;
  statusMessage: string;
}[] = [];

export async function init() {
  const status = Number(process.env.CADET_LOOKING_FOR_PROJECT_STATUS);
  if (isNaN(status))
    throw new Error(
      `CADET_LOOKING_FOR_PROJECT_STATUS "${process.env.CADET_LOOKING_FOR_PROJECT_STATUS}" is invalid`
    );
  const users = await Profile.findAll({
    where: { status: status },
    include: [User],
    order: [["id", "DESC"]],
    limit: 6,
  });
  for (const p of users.reverse())
    queue.push({
      id: p.user.id,
      username: p.user.username,
      profileImage: p.user.profileImage,
      blurImage: p.user.blurImage,
      position: p.position,
      statusMessage: p.statusMessage,
    });
}

export async function push(userId: number) {
  const u = await User.findOne({ where: { id: userId }, include: [Profile] });
  const arr = queue.map((x) => x.id);
  if (arr.includes(userId)) {
    queue.splice(arr.indexOf(userId), 1);
    queue.push({
      id: u!.id,
      username: u!.username,
      profileImage: u!.profileImage,
      blurImage: u!.blurImage,
      position: u!.profile!.position,
      statusMessage: u!.profile!.statusMessage,
    });
    return;
  }
  if (queue.length >= 6) queue.splice(0, 1);
  queue.push({
    id: u!.id,
    username: u!.username,
    profileImage: u!.profileImage,
    blurImage: u!.blurImage,
    position: u!.profile!.position,
    statusMessage: u!.profile!.statusMessage,
  });
}

export function pop(userId: number) {
  const arr = queue.map((x) => x.id);
  if (arr.includes(userId)) queue.splice(arr.indexOf(userId), 1);
}

export async function statusChanged(userId: number) {
  const arr = queue.map((x) => x.id);
  const status = Number(process.env.CADET_LOOKING_FOR_PROJECT_STATUS);
  var user: Profile | boolean | null = true;
  var offset = 0;
  pop(userId);
  while (user !== null) {
    user = await Profile.findOne({
      where: { status: status },
      include: [User],
      order: [["id", "DESC"]],
      offset: offset,
    });
    offset++;
    if (user && !arr.includes(user.userId)) {
      queue.push({
        id: user.user.id,
        username: user.user.username,
        profileImage: user.user.profileImage,
        blurImage: user.user.blurImage,
        position: user.position,
        statusMessage: user.statusMessage,
      });
      break;
    }
  }
}

export function changeblurImage(userId: number, image: string) {
  for (const u of queue) {
    if (u.id === userId) {
      u.blurImage = image;
      break;
    }
  }
}

export function getList() {
  return [...queue].reverse();
}
