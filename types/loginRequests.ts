export type LoginRequest = {
  email: string;
  tempPass: string;
  expiresAt: number;
  issuesAt: number;
  loggedIn: boolean;
};
