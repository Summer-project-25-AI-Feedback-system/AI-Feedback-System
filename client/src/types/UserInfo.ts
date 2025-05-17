export interface User {
  id: string;
  username: string;
  displayName?: string;
  profileUrl?: string;
  photos?: { value: string }[];
  provider?: string;
  _raw?: string;
  _json?: Record<string, unknown>;
}

export interface UserContextType {
  user: User | null;
  isLogin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => string;
}
