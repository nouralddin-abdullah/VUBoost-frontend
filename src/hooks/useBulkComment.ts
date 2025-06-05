import { useState } from 'react';
import { apiClient } from '../services/api';
import type { BulkCommentRequest, BulkCommentResponse, BulkCommentResult } from '../types';

interface UseBulkCommentState {
  isRunning: boolean;
  results: BulkCommentResult[];
  error: string | null;
  completed: boolean;
  successCount: number;
  failedCount: number;
}

export const useBulkComment = () => {
  const [state, setState] = useState<UseBulkCommentState>({
    isRunning: false,
    results: [],
    error: null,
    completed: false,
    successCount: 0,
    failedCount: 0,
  });

  const startBulkComment = async (postId: string) => {
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
      const request: BulkCommentRequest = { postId };
      const response = await apiClient.autoComment(request);

      if (!response.success) {
        throw new Error(response.error || 'Failed to start bulk comment');
      }

      const data = response.data!;
      const successCount = data.results.filter(r => r.status === 'commented').length;
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
      console.error('Bulk comment error:', error);
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
    startBulkComment,
    reset,
  };
};
