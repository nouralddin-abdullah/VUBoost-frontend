import React, { useState } from 'react';
import { UserPlus, Play, Pause, CheckCircle } from 'lucide-react';
import UserSelector from '../components/UserSelector';
import LoginPrompt from '../components/LoginPrompt';
import { useAuth } from '../hooks/useAuth';

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
  const [selectedUser, setSelectedUser] = useState<ImvuUser | null>(null);
  const [progress, setProgress] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();

  const handleUserAdd = (user: ImvuUser) => {
    setSelectedUser(user);
  };

  const handleUserRemove = () => {
    setSelectedUser(null);
  };  const handleStart = async () => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!selectedUser) {
      return;
    }

    setIsRunning(true);
    setProgress(0);

    try {
      const response = await fetch('http://localhost:3000/api/auto-follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usernameToFollow: selectedUser.username
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start auto-follow');
      }

      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRunning(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (error) {
      console.error('Auto-follow error:', error);
      setIsRunning(false);
    }
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
          {/* Target Configuration */}          <div className="card p-6">
            <UserSelector
              selectedUser={selectedUser}
              onUserAdd={handleUserAdd}
              onUserRemove={handleUserRemove}
              title="Target User"
              description="Search and select one IMVU user to follow"
              singleSelection={true}
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
                  <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedUser ? 1 : 0}
                    </p>
                    <p className="text-sm text-gray-600">Target User</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {progress > 0 ? 'Following...' : 'Ready'}
                    </p>
                    <p className="text-sm text-gray-600">Status</p>
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
                  {selectedUser ? '1 user selected' : 'No user selected'}
                </p>
                {!selectedUser && (
                  <p className="text-xs text-gray-500">
                    Search and add a user to get started
                  </p>
                )}
              </div>

              <div className="space-y-3">                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={!selectedUser}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Follow Process
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
            </div>
          </div>          {/* Operation Results */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Operation Results</h3>
            {!isRunning && progress === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">
                  <UserPlus className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">Results will appear here after starting follow operation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isRunning && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-700">Processing follow operation...</span>
                  </div>
                )}

                {progress === 100 && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700">Follow operation completed!</span>
                  </div>
                )}
                
                {(progress > 0) && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {progress === 100 ? '1' : '0'}
                      </p>
                      <p className="text-sm text-gray-600">Followed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {progress}%
                      </p>
                      <p className="text-sm text-gray-600">Progress</p>
                    </div>
                  </div>
                )}
              </div>
            )}</div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPrompt
        isVisible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="You need to be logged in to start bulk follow operations."
      />
    </div>
  );
};

export default BulkFollow;
