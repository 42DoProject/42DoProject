export interface IFeed {
  userId: number;
  date: number;
  type: number;
  args: Array<{
    userId?: Number;
    username?: String;
    status?: String;
    projectName?: String;
    projectId?: Number;
    loungeId?: Number;
    comment?: String;
  }>;
}

export interface IFollowUser {
  userId: number;
  username: string;
  profileImage: string;
  position: number;
}
