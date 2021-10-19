export interface IUser {
  index: string;
  id: number;
  uesrname: string;
  profileImage: string;
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
