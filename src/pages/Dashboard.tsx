import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Users, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      name: 'Total Likes',
      value: '12,483',
      change: '+12%',
      changeType: 'positive',
      icon: Heart,
    },
    {
      name: 'Comments Posted',
      value: '3,291',
      change: '+8%',
      changeType: 'positive',
      icon: MessageCircle,
    },
    {
      name: 'New Followers',
      value: '1,834',
      change: '+23%',
      changeType: 'positive',
      icon: UserPlus,
    },
    {
      name: 'Active Accounts',
      value: '24',
      change: '0%',
      changeType: 'neutral',
      icon: Users,
    },
  ];

  const recentActivities = [
    {
      id: '1',
      action: 'Bulk Like',
      target: '50 posts',
      status: 'completed',
      time: '2 minutes ago',
      success: 48,
      failed: 2,
    },
    {
      id: '2',
      action: 'Bulk Follow',
      target: '25 users',
      status: 'completed',
      time: '15 minutes ago',
      success: 23,
      failed: 2,
    },
    {
      id: '3',
      action: 'Bulk Comment',
      target: '30 posts',
      status: 'in_progress',
      time: '20 minutes ago',
      success: 15,
      failed: 0,
    },
  ];

  return (
    <div className="space-y-6">      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 text-white">Welcome to VU ARABIA</h1>
        <p className="text-primary-100">
          Manage your IMVU automation campaigns with powerful bulk actions and real-time analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status.replace('_', ' ')}
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
