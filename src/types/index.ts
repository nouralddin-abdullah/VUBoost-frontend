// Service types for IMVU automation
export interface IMVUAccount {
  id: string;
  username: string;
  status: 'active' | 'inactive' | 'banned';
  lastUsed: Date;
}

export interface BulkActionRequest {
  accountIds: string[];
  action: 'like' | 'comment' | 'follow';
  targets: string[];
  message?: string;
}

export interface BulkActionResult {
  id: string;
  accountId: string;
  target: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  timestamp: Date;
}

export interface ServiceConfig {
  maxConcurrentActions: number;
  delayBetweenActions: number;
  retryAttempts: number;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  description?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  Plan: string;
  plan?: string; // Optional field for backward compatibility
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    newUser: User;
  };
}

// Backend user response (with _id instead of id)
export interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  Plan: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

// Backend response structure for user data
export interface BackendUserResponse {
  status: string;
  user: BackendUser;
}
