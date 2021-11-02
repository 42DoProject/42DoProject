export interface IUser {
  index: string;
  id: number;
  username: string;
  profileImage: string;
  blurImage: string;
  status: number;
  position: number;
  skill: number[];
  level: number;
  statusMessage: string;
}

export interface IProject {
  index: string[];
  id: number;
  image: string;
  title: string;
}

export interface IObject {
  user: IUser[];
  project: IProject[];
}
