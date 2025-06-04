import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../services/api';
import type { User } from '../types';

// Debug utility for development
const isDev = import.meta.env.DEV;
const debugLog = (message: string, data?: any) => {
  if (isDev) {
    console.log(`🔐 [Auth] ${message}`, data || '');
  }
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuth = async () => {
      debugLog('Starting authentication check');
      
      try {
        if (apiClient.isAuthenticated()) {
          debugLog('Token found, attempting to get user data');
          
          // First try to get user from JWT token
          const localUser = apiClient.getCurrentUser();
          if (localUser) {            debugLog('User data retrieved from token', { userId: localUser.id, email: localUser.email });
            setUser(localUser);
            setIsLoading(false);
            
            // Check if we need to refresh data from backend
            const shouldRefresh = apiClient.shouldRefreshUserData();
            debugLog('Should refresh user data from backend?', shouldRefresh);
            
            if (shouldRefresh) {
              // Only fetch from backend if needed (token near expiry, or periodic refresh)
              try {
                debugLog('Refreshing user data from backend');
                const userResult = await apiClient.fetchCurrentUser();
                debugLog('Backend response', userResult);
                
                if (userResult.success && userResult.data) {
                  debugLog('Backend validation successful');
                  
                  // Handle different possible response structures
                  let rawUser = null;
                  
                  // Check for nested structure: {data: {user: {...}}}
                  if ((userResult.data as any).data?.user) {
                    rawUser = (userResult.data as any).data.user;
                    debugLog('Using nested structure: response.data.user', rawUser);
                  }
                  // Check for single nested: {user: {...}}
                  else if ((userResult.data as any).user) {
                    rawUser = (userResult.data as any).user;
                    debugLog('Using single nested: response.user', rawUser);
                  }
                  // Use direct structure: {...}
                  else {
                    rawUser = userResult.data;
                    debugLog('Using direct structure: response', rawUser);
                  }
                  
                  if (rawUser && (rawUser.id || rawUser._id) && rawUser.email) {
                    const normalizedUser: User = {
                      id: rawUser.id || rawUser._id,
                      firstName: rawUser.firstName || 'User',
                      lastName: rawUser.lastName || '',
                      email: rawUser.email,
                      role: rawUser.role || 'user',
                      Plan: rawUser.Plan || rawUser.plan || 'basic',
                      points: rawUser.points || 0,
                      createdAt: rawUser.createdAt || rawUser.created_at,
                      updatedAt: rawUser.updatedAt || rawUser.updated_at
                    };
                    debugLog('Updating user data from backend', normalizedUser);
                    setUser(normalizedUser);
                    
                    // Mark that we successfully refreshed user data
                    apiClient.markUserDataRefreshed();
                  } else {
                    debugLog('Backend user data incomplete, keeping cached user');
                  }
                } else if (!userResult.success) {
                  debugLog('Backend validation failed, clearing token', { error: userResult.error });
                  // Token is invalid, clear it
                  apiClient.logout();
                  setUser(null);
                }
              } catch (backendError) {                // Backend might be down, but we can still use the cached token
                debugLog('Backend refresh error, continuing with cached user', backendError);
              }
            } else {
              debugLog('Using cached user data, no backend refresh needed');
            }
          } else {
            debugLog('Token exists but cannot decode user data, clearing token');
            // Token exists but can't decode it, clear it
            apiClient.logout();
            setIsLoading(false);
          }
        } else {
          debugLog('No valid token found');
          setIsLoading(false);
        }
      } catch (error) {
        debugLog('Authentication check error, clearing token', error);
        // Clear invalid token
        apiClient.logout();
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    debugLog('Attempting login', { email });
    
    try {
      const result = await apiClient.login({ email, password });
      
      if (result.success && result.data) {
        debugLog('Login successful', { userId: result.data.data.newUser.id });
        setUser(result.data.data.newUser);
        return { success: true };
      } else {
        debugLog('Login failed', { error: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      debugLog('Login error', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiClient.signup(userData);
      
      if (result.success && result.data) {
        setUser(result.data.data.newUser);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  const logout = () => {
    debugLog('Logging out user');
    apiClient.logout();
    setUser(null);
  };

  const refreshUserData = async () => {
    debugLog('Manual user data refresh requested');
    apiClient.forceRefreshUserData();
    
    if (apiClient.isAuthenticated()) {
      try {
        const userResult = await apiClient.fetchCurrentUser();
        if (userResult.success && userResult.data) {
          // Handle the same parsing logic as in checkAuth
          let rawUser = null;
          
          if ((userResult.data as any).data?.user) {
            rawUser = (userResult.data as any).data.user;
          } else if ((userResult.data as any).user) {
            rawUser = (userResult.data as any).user;
          } else {
            rawUser = userResult.data;
          }
          
          if (rawUser && (rawUser.id || rawUser._id) && rawUser.email) {
            const normalizedUser: User = {
              id: rawUser.id || rawUser._id,
              firstName: rawUser.firstName || 'User',
              lastName: rawUser.lastName || '',
              email: rawUser.email,
              role: rawUser.role || 'user',
              Plan: rawUser.Plan || rawUser.plan || 'basic',
              points: rawUser.points || 0,
              createdAt: rawUser.createdAt || rawUser.created_at,
              updatedAt: rawUser.updatedAt || rawUser.updated_at
            };
            setUser(normalizedUser);
            apiClient.markUserDataRefreshed();
            debugLog('User data manually refreshed', normalizedUser);
          }
        }
      } catch (error) {
        debugLog('Manual refresh failed', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
