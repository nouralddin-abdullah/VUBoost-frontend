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

// Statistics types
export interface Statistics {
  _id: string;
  totalLikes: number;
  totalComments: number;
  totalFollows: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Activity types
export interface Activity {
  _id: string;
  type: 'like' | 'comment' | 'follow';
  user: string;
  targetId: string;
  totalBots: number;
  successCount: number;
  failedCount: number;
  timeAgo: string;
  createdAt: string;
}

export interface ActivitiesResponse {
  activities: Activity[];
  total: number;
}

// Bulk action result types
export interface BulkLikeResult {
  email: string;
  status: 'liked';
}

export interface BulkCommentResult {
  email: string;
  status: 'commented';
  comment: string;
}

export interface BulkLikeResponse {
  message: string;
  results: BulkLikeResult[];
}

export interface BulkCommentResponse {
  message: string;
  results: BulkCommentResult[];
}

// Request types for bulk actions
export interface BulkLikeRequest {
  postId: string;
}

export interface BulkCommentRequest {
  postId: string;
}
