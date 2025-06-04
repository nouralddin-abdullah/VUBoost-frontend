// API service for IMVU automation backend
import type { 
  BulkActionRequest, 
  BulkActionResult, 
  IMVUAccount, 
  ApiResponse, 
  LoginRequest, 
  SignUpRequest, 
  AuthResponse, 
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Base API client
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private lastUserRefresh: number = 0;
  private readonly USER_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      // Add authorization header if token exists
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }  // Authentication methods
  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<AuthResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (result.success && result.data?.token) {
      this.token = result.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return result;
  }

  async signup(signupData: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<AuthResponse>('/user/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    if (result.success && result.data?.token) {
      this.token = result.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return result;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  isAuthenticated(): boolean {
    if (!this.token) return false;
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, remove it
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      // Invalid token, remove it
      this.logout();
      return false;
    }
  }
  isTokenValid(): boolean {
    if (!this.token) return false;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token has expiration and if it's expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }  getCurrentUser(): User | null {
    if (!this.token) return null;
    
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      
      // JWT payload should contain user information
      // Handle different possible structures in the JWT payload
      let userData = null;
      
      // Check for nested structure: {data: {user: {...}}} or {user: {...}}
      if (payload.data?.user) {
        userData = payload.data.user;
      } else if (payload.user) {
        userData = payload.user;
      } else if (payload.id || payload._id) {
        // Direct user data in payload
        userData = payload;
      }
      
      if (userData && (userData.id || userData._id)) {
        return {
          id: userData.id || userData._id,
          firstName: userData.firstName || userData.first_name || 'User',
          lastName: userData.lastName || userData.last_name || '',
          email: userData.email || '',
          role: userData.role || 'user',
          Plan: userData.Plan || userData.plan || 'free',
          points: userData.points || 0,
          createdAt: userData.createdAt || userData.created_at,
          updatedAt: userData.updatedAt || userData.updated_at
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
      return null;
    }
  }

  // Fetch current user from backend
  async fetchCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/me');
  }

  // Account management
  async getAccounts(): Promise<ApiResponse<IMVUAccount[]>> {
    return this.request<IMVUAccount[]>('/accounts');
  }

  async addAccount(username: string, password: string): Promise<ApiResponse<IMVUAccount>> {
    return this.request<IMVUAccount>('/accounts', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async removeAccount(accountId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // Bulk actions
  async bulkLike(request: BulkActionRequest): Promise<ApiResponse<string>> {
    return this.request<string>('/actions/bulk-like', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async bulkComment(request: BulkActionRequest): Promise<ApiResponse<string>> {
    return this.request<string>('/actions/bulk-comment', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async bulkFollow(request: BulkActionRequest): Promise<ApiResponse<string>> {
    return this.request<string>('/actions/bulk-follow', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Action results
  async getActionResults(actionId: string): Promise<ApiResponse<BulkActionResult[]>> {
    return this.request<BulkActionResult[]>(`/actions/${actionId}/results`);
  }

  // Statistics
  async getStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/stats');
  }

  // Smart refresh logic - only refresh if needed
  shouldRefreshUserData(): boolean {
    const now = Date.now();
    const timeSinceLastRefresh = now - this.lastUserRefresh;
    
    // Refresh if:
    // 1. Never refreshed before
    // 2. More than 5 minutes since last refresh
    // 3. Token expires in less than 1 hour
    if (this.lastUserRefresh === 0) {
      return true;
    }
    
    if (timeSinceLastRefresh > this.USER_REFRESH_INTERVAL) {
      return true;
    }
    
    // Check if token expires soon
    if (this.token) {
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;
        
        // Refresh if token expires in less than 1 hour
        if (timeUntilExpiry < 3600) {
          return true;
        }
      } catch {
        return true; // Invalid token, should refresh
      }
    }
    
    return false;
  }

  markUserDataRefreshed(): void {
    this.lastUserRefresh = Date.now();
  }

  // Force refresh user data (for manual refresh)
  forceRefreshUserData(): void {
    this.lastUserRefresh = 0;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
