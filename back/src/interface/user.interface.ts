export interface IFeed {
  userId: number;
  date: number;
  type: number;
  args: Array<{
    userId?: Number;
    username?: String;
    status?: Number;
    project?: String;
    projectId?: Number;
  }>;
}

export interface IFollowUser {
  userId: number;
  username: string;
  profileImage: string;
  position: number;
}
