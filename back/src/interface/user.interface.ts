export interface IFeed {
  userId: number;
  date: number;
  message: string;
  args: string[];
}

export interface IFollowUser {
  userId: number;
  username: string;
  profileImage: string;
  statusMessage: string;
}
