import { useState } from 'react';
import { apiClient } from '../services/api';
import type { BulkLikeRequest, BulkLikeResult } from '../types';

interface UseBulkLikeState {
  isRunning: boolean;
  results: BulkLikeResult[];
  error: string | null;
  completed: boolean;
  successCount: number;
  failedCount: number;
}

export const useBulkLike = () => {
  const [state, setState] = useState<UseBulkLikeState>({
    isRunning: false,
    results: [],
    error: null,
    completed: false,
    successCount: 0,
    failedCount: 0,
  });

  const startBulkLike = async (postId: string) => {
    if (!postId) {
      setState(prev => ({ ...prev, error: 'Post ID is required' }));
      return;
    }

    setState({
      isRunning: true,
      results: [],
      error: null,
      completed: false,
      successCount: 0,
      failedCount: 0,
    });

    try {
      const request: BulkLikeRequest = { postId };
      const response = await apiClient.autoLike(request);

      if (!response.success) {
        throw new Error(response.error || 'Failed to start bulk like');
      }

      const data = response.data!;
      const successCount = data.results.filter(r => r.status === 'liked').length;
      const failedCount = data.results.length - successCount;

      setState({
        isRunning: false,
        results: data.results,
        error: null,
        completed: true,
        successCount,
        failedCount,
      });
    } catch (error) {
      console.error('Bulk like error:', error);
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        completed: false,
      }));
    }
  };

  const reset = () => {
    setState({
      isRunning: false,
      results: [],
      error: null,
      completed: false,
      successCount: 0,
      failedCount: 0,
    });
  };

  return {
    ...state,
    startBulkLike,
    reset,
  };
};
