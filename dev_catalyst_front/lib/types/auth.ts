export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  plan: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  valid: boolean;
}

export interface AuthStatus {
  authenticated: boolean;
  user: User | null;
  expires_in: number | null;
}
