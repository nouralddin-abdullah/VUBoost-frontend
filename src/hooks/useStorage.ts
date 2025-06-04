import { useState, useEffect } from 'react';
import type { IMVUAccount } from '../types';
import { storage } from '../utils/helpers';

// Hook for managing accounts
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<IMVUAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load accounts from localStorage on mount
    const savedAccounts = storage.get<IMVUAccount[]>('imvu_accounts', []);
    setAccounts(savedAccounts);
    setLoading(false);
  }, []);

  const addAccount = (account: IMVUAccount) => {
    const updatedAccounts = [...accounts, account];
    setAccounts(updatedAccounts);
    storage.set('imvu_accounts', updatedAccounts);
  };

  const removeAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    setAccounts(updatedAccounts);
    storage.set('imvu_accounts', updatedAccounts);
  };

  const updateAccount = (accountId: string, updates: Partial<IMVUAccount>) => {
    const updatedAccounts = accounts.map(acc =>
      acc.id === accountId ? { ...acc, ...updates } : acc
    );
    setAccounts(updatedAccounts);
    storage.set('imvu_accounts', updatedAccounts);
  };
  return {
    accounts,
    loading,
    addAccount,
    removeAccount,
    updateAccount,
  };
};

// Hook for managing automation settings
export const useSettings = () => {
  const [settings, setSettings] = useState({
    maxConcurrentActions: 5,
    delayBetweenActions: 10,
    retryAttempts: 3,
    defaultLikeDelay: 5,
    defaultCommentDelay: 10,
    defaultFollowDelay: 15,
  });

  useEffect(() => {
    const savedSettings = storage.get('automation_settings', settings);
    setSettings(savedSettings);
  }, []);

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    storage.set('automation_settings', updatedSettings);
  };

  return {
    settings,
    updateSettings,
  };
};

// Hook for managing local storage state
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    storage.set(key, valueToStore);
  };

  return [value, setStoredValue] as const;
};
