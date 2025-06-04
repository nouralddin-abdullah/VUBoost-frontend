// Debug utilities for authentication
export const debugAuth = {
  logTokenInfo: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('🔐 No auth token found');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp && payload.exp < currentTime;
      
      console.log('🔐 Auth Token Info:', {
        hasToken: !!token,
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'unknown',
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'never',
        isExpired,
        timeUntilExpiry: payload.exp ? Math.max(0, payload.exp - currentTime) : Infinity
      });
    } catch (error) {
      console.error('🔐 Failed to decode token:', error);
    }
  },
  
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    console.log('🔐 Auth token cleared');
  },
  
  checkAuthState: () => {
    const token = localStorage.getItem('auth_token');
    console.log('🔐 Auth State Check:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      storageKeys: Object.keys(localStorage)
    });
  }
};

// Make it available globally for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
}
