// Utility functions for the application

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate IMVU URL
export const isValidImvuUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  return url.includes('imvu.com');
};

// Parse targets (URLs or usernames)
export const parseTargets = (input: string): string[] => {
  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Validate username
export const isValidUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
};

// Generate random delay
export const getRandomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate success rate
export const calculateSuccessRate = (successful: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Sleep function for delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
