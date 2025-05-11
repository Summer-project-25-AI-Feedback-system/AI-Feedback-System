export interface User {
  id: string;
  username: string;
}

export interface UserContextType {
  user: User | null;
  loggedIn: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => void;
}
