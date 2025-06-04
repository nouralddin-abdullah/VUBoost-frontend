import React, { useState } from 'react';
import { UserPlus, Play, Pause } from 'lucide-react';
import UserSelector from '../components/UserSelector';

interface ImvuUser {
  display_name: string;
  username: string;
  country: string;
  tagline: string;
  legacy_cid: number;
  avatar_image: string;
  thumbnail_url: string;
}

const BulkFollow: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ImvuUser[]>([]);
  const [progress, setProgress] = useState(0);

  const handleUserAdd = (user: ImvuUser) => {
    setSelectedUsers(prev => [...prev, user]);
  };

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.legacy_cid !== userId));
  };

  const handleStart = () => {
    setIsRunning(true);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Follow</h1>
          <p className="text-gray-600">Automatically follow users across multiple accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Configuration */}
          <div className="card p-6">
            <UserSelector
              selectedUsers={selectedUsers}
              onUserAdd={handleUserAdd}
              onUserRemove={handleUserRemove}
              title="Target Users"
              description="Search and select IMVU users to follow"
            />
            
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Be careful with follow limits to avoid account restrictions. IMVU may limit accounts that follow too many users too quickly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {(isRunning || progress > 0) && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">67</p>
                    <p className="text-sm text-gray-600">Followed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">30</p>
                    <p className="text-sm text-gray-600">Remaining</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Control Panel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
                  <UserPlus className="w-10 h-10 text-primary-600" />
                </div>
              </div>              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  {selectedUsers.length} users to follow
                </p>
                {selectedUsers.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Search and add users to get started
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={selectedUsers.length === 0}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Bulk Follow
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Process
                  </button>
                )}
              </div>

              {/* Show backend payload format example */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Backend Format:</p>
                  <code className="text-xs text-gray-800 block">
                    {JSON.stringify({
                      users: selectedUsers.map(user => ({
                        username: user.username,
                        legacy_cid: user.legacy_cid
                      }))
                    }, null, 2)}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Follows</span>
                <span className="text-sm font-medium text-gray-900">456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Speed</span>
                <span className="text-sm font-medium text-gray-900">4/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Follow Backs</span>
                <span className="text-sm font-medium text-blue-600">23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFollow;
