export interface IUser {
  index: string;
  id: number;
  username: string;
  profileImage: string;
  status: number;
  position: number;
  skill: number[];
  level: number;
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
