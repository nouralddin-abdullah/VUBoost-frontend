import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { Statistics, Activity } from '../types';

interface DashboardData {
  statistics: Statistics | null;
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    statistics: null,
    activities: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch statistics and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        apiClient.getStatistics(),
        apiClient.getActivities(),
      ]);

      // Handle statistics response
      if (!statsResponse.success) {
        console.warn('Statistics fetch failed:', statsResponse.error);
        // Don't throw here, continue with activities
      }

      // Handle activities response
      if (!activitiesResponse.success) {
        console.warn('Activities fetch failed:', activitiesResponse.error);
        // Don't throw here, use partial data
      }

      setData({
        statistics: statsResponse.success ? statsResponse.data || null : null,
        activities: activitiesResponse.success ? activitiesResponse.data?.activities || [] : [],
        loading: false,
        error: (!statsResponse.success && !activitiesResponse.success) 
          ? 'Failed to fetch dashboard data' 
          : null,
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      }));
    }
  }, []);
  useEffect(() => {
    fetchDashboardData();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return {
    ...data,
    refetch: fetchDashboardData,
  };
};
