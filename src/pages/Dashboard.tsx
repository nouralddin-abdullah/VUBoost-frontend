import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Users, TrendingUp, Activity } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { statistics, activities, loading, error, refetch } = useDashboard();

  // Define type for change type
  type ChangeType = 'positive' | 'negative' | 'neutral';

  // Create stats array from backend data
  const stats = statistics ? [
    {
      name: 'Total Likes',
      value: statistics.totalLikes.toLocaleString(),
      change: '+12%', // You can calculate this based on historical data
      changeType: 'positive' as ChangeType,
      icon: Heart,
    },
    {
      name: 'Comments Posted',
      value: statistics.totalComments.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as ChangeType,
      icon: MessageCircle,
    },
    {
      name: 'New Followers',
      value: statistics.totalFollows.toLocaleString(),
      icon: UserPlus,
    },
  ] : [];

  // Map backend activities to display format
  const recentActivities = activities.map(activity => ({
    id: activity._id,
    action: activity.type === 'follow' ? 'Bulk Follow' : 
            activity.type === 'like' ? 'Bulk Like' : 'Bulk Comment',
    target: `${activity.totalBots} accounts used`,
    status: 'completed' as const,
    time: activity.timeAgo,
    success: activity.successCount,
    failed: activity.failedCount,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2 text-white">Welcome to VU ARABIA</h1>
          <p className="text-primary-100">
            Loading your dashboard data...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2 text-white">Error Loading Dashboard</h1>
          <p className="text-red-100 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 text-white">Welcome to VU ARABIA</h1>
        <p className="text-primary-100">
          Manage your IMVU automation campaigns with powerful bulk actions and real-time analytics.
        </p>
      </div>      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <button 
                onClick={refetch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh data"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.target}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{activity.success} success</p>
                      {activity.failed > 0 && (
                        <p className="text-sm font-medium text-red-600">{activity.failed} failed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
          </div>          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/services/bulk-like')}
                className="btn-secondary text-left p-4 h-auto"
              >
                <Heart className="w-6 h-6 mb-2 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Bulk Like</h4>
                  <p className="text-sm text-gray-600">Start liking posts</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/services/bulk-comment')}
                className="btn-secondary text-left p-4 h-auto"
              >
                <MessageCircle className="w-6 h-6 mb-2 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Bulk Comment</h4>
                  <p className="text-sm text-gray-600">Add comments</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/services/bulk-follow')}
                className="btn-secondary text-left p-4 h-auto"
              >
                <UserPlus className="w-6 h-6 mb-2 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Bulk Follow</h4>
                  <p className="text-sm text-gray-600">Follow users</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('')}
                className="btn-secondary text-left p-4 h-auto"
              >
                <Users className="w-6 h-6 mb-2 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Manage Accounts</h4>
                  <p className="text-sm text-gray-600">View accounts</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
