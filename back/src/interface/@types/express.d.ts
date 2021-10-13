import { User } from "../../models/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      urls?: string[];
    }
  }
}
