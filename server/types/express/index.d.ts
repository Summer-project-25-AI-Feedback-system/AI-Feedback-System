import { Profile } from "passport-github2";

declare global {
  namespace Express {
    interface User extends Profile {}

    interface Request {
      githubId?: string;
      organizationId?: string;
    }
  }
}

export {};