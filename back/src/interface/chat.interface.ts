export interface IChatRow {
  uuid: string;
  date: number;
  userId: number;
  message: string;
}

export interface IChatUser {
  id: number;
  username: string;
  profileImage: string;
}

export interface IChatRoom {
  uuid: string;
  type: number;
  users: IChatUser[];
}

export interface ILastChat {
  uuid: string;
  userId: number;
  availableDate: number;
  date: number;
}

export interface IChatMessage {
  date: number;
  userId: number;
  message: string;
}
