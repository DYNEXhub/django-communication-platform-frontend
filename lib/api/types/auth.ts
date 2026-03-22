/**
 * Authentication types matching Django backend models
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT' | 'VIEWER';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  avatar: string | null;
  is_active: boolean;
  date_joined: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}
