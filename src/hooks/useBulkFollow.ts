import { useState } from 'react';


// Define the necessary types
interface BulkFollowRequest {
  usernameToFollow: string;
}

interface BulkFollowResult {
  email: string;
  status: 'followed';
}

interface BulkFollowResponse {
  message: string;
  results: BulkFollowResult[];
}

interface UseBulkFollowState {
  isRunning: boolean;
  results: BulkFollowResult[];
  error: string | null;
  completed: boolean;
  successCount: number;
  failedCount: number;
}

export const useBulkFollow = () => {
  const [state, setState] = useState<UseBulkFollowState>({
    isRunning: false,
    results: [],
    error: null,
    completed: false,
    successCount: 0,
    failedCount: 0,
  });
  const startBulkFollow = async (username: string) => {
    if (!username) {
      setState(prev => ({ ...prev, error: 'Username is required' }));
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
      const request: BulkFollowRequest = { usernameToFollow: username };
      const response = await fetch('http://localhost:3000/api/auto-follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to start auto-follow');
      }

      const data: BulkFollowResponse = await response.json();
      const successCount = data.results.filter(r => r.status === 'followed').length;
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
      console.error('Bulk follow error:', error);
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
    startBulkFollow,
    reset,
  };
};
