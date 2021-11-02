import { IObject, IProject, IUser } from "../interface/search.interface";
import { Project } from "../models/project/project.model";
import { Profile } from "../models/user/profile.model";
import { User } from "../models/user/user.model";

var object: IObject;

export async function init() {
  object = { user: [], project: [] };
  const users = await User.findAll({ include: [Profile] });
  const projects = await Project.findAll();
  for (const u of users)
    object.user.push({
      index: u.username,
      id: u.id,
      username: u.username,
      profileImage: u.profileImage,
      blurImage: u.blurImage,
      status: u.profile!.status,
      position: u.profile!.position,
      skill: u.profile!.skill,
      level: u.profile!.level,
      statusMessage: u.profile!.statusMessage,
    });
  for (const p of projects) {
    const index = p.title.toLowerCase().split(" ");
    object.project.push({
      index: index,
      id: p.id,
      image: p.thumbnailImage,
      title: p.title,
    });
  }
  console.log("[search] ready");
}

function compare(src: string, target: string): boolean {
  for (var i = 0; i < src.length; i++) if (src[i] != target[i]) return false;
  return true;
}

export function getUser(
  page: number,
  blur: boolean
): { count: number; list: IUser[] } {
  var userList = [...object.user].reverse().slice((page - 1) * 15, page * 15);
  userList = JSON.parse(JSON.stringify(userList));
  if (blur) for (const u of userList) u.profileImage = u.blurImage;
  return {
    count: object.user.length,
    list: userList,
  };
}

export function searchUser(name: string, blur: boolean): IUser[] {
  const users: IUser[] = [];
  for (const u of object.user)
    if (compare(name, u.index)) {
      const user = JSON.parse(JSON.stringify(u));
      if (blur) user.profileImage = user.blurImage;
      users.push(user);
    }
  return users;
}

export function searchUserFilter(
  filter: {
    status?: number;
    position?: number;
    skill?: number[];
    level?: number;
  },
  page: number,
  blur: boolean
): { count: number; list: IUser[] } {
  const users: IUser[] = [];
  var threshold = 0;
  if (filter.status !== undefined) threshold++;
  if (filter.position !== undefined) threshold++;
  if (filter.skill !== undefined) threshold++;
  if (filter.level !== undefined) threshold++;
  for (const u of object.user) {
    var condition = 0;
    if (filter.status !== undefined && filter.status === u.status) condition++;
    if (filter.position !== undefined && filter.position === u.position)
      condition++;
    if (
      filter.skill !== undefined &&
      filter.skill.every((x) => u.skill.includes(x))
    )
      condition++;
    if (filter.level !== undefined && filter.level <= u.level) condition++;
    if (condition === threshold) {
      users.push(u);
    }
  }
  var userList = [...users].reverse().slice((page - 1) * 15, page * 15);
  userList = JSON.parse(JSON.stringify(userList));
  if (blur) for (const u of userList) u.profileImage = u.blurImage;
  return {
    count: users.length,
    list: userList,
  };
}

export function getProject(): IProject[] {
  return [...object.project].reverse();
}

export function searchProject(name: string[]) {
  var isort = [];
  var projects: IProject[] = object.project;
  for (const n in name) {
    const result: { sort: number; project: IProject }[] = [];
    for (const p of projects)
      for (const i in p.index)
        if (compare(name[n], p.index[i])) {
          result.push({ sort: Number(i), project: p });
          break;
        }
    projects = result.sort((a, b) => a.sort - b.sort).map((x) => x.project);
    isort.push(projects);
  }
  const isIn: any[] = [];
  const project = [];
  for (const ps of isort.reverse())
    for (const p of ps)
      if (isIn[p.id] !== true) {
        isIn[p.id] = true;
        project.push({
          id: p.id,
          title: p.title,
          image: p.image,
        });
      }
  return project;
}

export function search(name: string, blur: boolean) {
  return {
    user: searchUser(name, blur),
    project: searchProject(name.toLowerCase().split(" ")),
  };
}

export function insertUser(user: {
  id: number;
  username: string;
  profileImage: string;
  blurImage: string;
  status: number;
  position: number;
  skill: number[];
  level: number;
  statusMessage: string;
}) {
  object.user.push({
    index: user.username,
    id: user.id,
    username: user.username,
    profileImage: user.profileImage,
    blurImage: user.blurImage,
    status: user.status,
    position: user.position,
    skill: user.skill,
    level: user.level,
    statusMessage: user.statusMessage,
  });
}

export function insertProject(project: {
  id: number;
  image: string;
  title: string;
}) {
  const index = project.title.toLowerCase().split(" ");
  object.project.push({
    index: index,
    id: project.id,
    image: project.image,
    title: project.title,
  });
}

export function updateUser(
  user: {
    profileImage?: string;
    blurImage?: string;
    status?: number;
    position?: number;
    skill?: number[];
    level?: number;
    statusMessage?: string;
  },
  where: { id: number }
) {
  for (const u of object.user)
    if (u.id === where.id) {
      if (user.profileImage !== undefined) u.profileImage = user.profileImage;
      if (user.blurImage !== undefined) u.blurImage = user.blurImage;
      if (user.status !== undefined) u.status = user.status;
      if (user.position !== undefined) u.position = user.position;
      if (user.skill !== undefined) u.skill = user.skill;
      if (user.level !== undefined) u.level = user.level;
      if (user.statusMessage !== undefined)
        u.statusMessage = user.statusMessage;
    }
}

export function updateProject(
  project: { title?: string; image?: string },
  where: { id: number }
) {
  for (const u of object.project)
    if (u.id === where.id) {
      if (project.title !== undefined) {
        u.index = project.title.toLowerCase().split(" ");
        u.title = project.title;
      }
      if (project.image !== undefined) u.image = project.image;
    }
}
