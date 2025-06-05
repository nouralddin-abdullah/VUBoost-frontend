import React, { useState } from 'react';
import { UserPlus, Play, CheckCircle, AlertCircle } from 'lucide-react';
import UserSelector from '../components/UserSelector';
import LoginPrompt from '../components/LoginPrompt';
import { useAuth } from '../hooks/useAuth';
import { useBulkFollow } from '../hooks/useBulkFollow';

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
  const [selectedUser, setSelectedUser] = useState<ImvuUser | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { 
    isRunning, 
    results, 
    error, 
    completed, 
    successCount, 
    failedCount, 
    startBulkFollow, 
    reset 
  } = useBulkFollow();
  const { user } = useAuth();

  const handleUserAdd = (user: ImvuUser) => {
    setSelectedUser(user);
    reset(); // Reset previous results when selecting a new user
  };

  const handleUserRemove = () => {
    setSelectedUser(null);
    reset();
  };
    const handleStart = async () => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!selectedUser) {
      return;
    }
    
    await startBulkFollow(selectedUser.username);
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
          </div>          {/* Progress Section */}
          {(isRunning || completed) && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completed ? 100 : isRunning ? 50 : 0}%` }}
                  ></div>
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
                      {isRunning ? 'Following...' : completed ? 'Completed' : 'Ready'}
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
              </div>              <div className="space-y-3">
                <button
                  onClick={handleStart}
                  disabled={!selectedUser || isRunning}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Bulk Follow
                    </>
                  )}
                </button>
                
                {(completed || error) && (
                  <button
                    onClick={reset}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>          {/* Operation Results */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Operation Results</h3>
            {!isRunning && !completed && !error ? (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">
                  <UserPlus className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">Results will appear here after starting follow operation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                
                {isRunning && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-700">Processing follow operation...</span>
                  </div>
                )}

                {completed && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700">Follow operation completed!</span>
                  </div>
                )}
                
                {(completed || isRunning) && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{successCount}</p>
                      <p className="text-sm text-gray-600">Followed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{results.length}</p>
                      <p className="text-sm text-gray-600">Total</p>
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
