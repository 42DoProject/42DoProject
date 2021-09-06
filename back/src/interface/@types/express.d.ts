declare module Express {
  export interface Request {
    user?: string; // -> change model User, not string;;
  }
}
