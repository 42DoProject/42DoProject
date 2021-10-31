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
      status: u.profile!.status,
      position: u.profile!.position,
      skill: u.profile!.skill,
      level: u.profile!.level,
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

export function getUser(page: number): { count: number; list: IUser[] } {
  return {
    count: object.user.length,
    list: [...object.user].reverse().slice((page - 1) * 15, page * 15),
  };
}

export function searchUser(name: string): IUser[] {
  const users: IUser[] = [];
  for (const u of object.user) if (compare(name, u.index)) users.push(u);
  return users;
}

export function searchUserFilter(
  filter: {
    status?: number;
    position?: number;
    skill?: number[];
    level?: number;
  },
  page: number
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
  return {
    count: users.length,
    list: [...users].reverse().slice((page - 1) * 15, page * 15),
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

export function search(name: string) {
  return {
    user: searchUser(name),
    project: searchProject(name.toLowerCase().split(" ")),
  };
}

export function insertUser(user: {
  id: number;
  username: string;
  profileImage: string;
  status: number;
  position: number;
  skill: number[];
  level: number;
}) {
  object.user.push({
    index: user.username,
    id: user.id,
    username: user.username,
    profileImage: user.profileImage,
    status: user.status,
    position: user.position,
    skill: user.skill,
    level: user.level,
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
    status?: number;
    position?: number;
    skill?: number[];
    level?: number;
  },
  where: { id: number }
) {
  for (const u of object.user)
    if (u.id === where.id) {
      if (user.profileImage !== undefined) u.profileImage = user.profileImage;
      if (user.status !== undefined) u.status = user.status;
      if (user.position !== undefined) u.position = user.position;
      if (user.skill !== undefined) u.skill = user.skill;
      if (user.level !== undefined) u.level = user.level;
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
