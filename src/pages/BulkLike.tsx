import React, { useState } from 'react';
import { Heart, Play, Pause, Trash2 } from 'lucide-react';
import PostSelector from '../components/PostSelector';

const BulkLike: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
  };

  const handlePostDeselect = () => {
    setSelectedPost(null);
  };

  const clearSelectedPost = () => {
    setSelectedPost(null);
  };

  const handleStart = () => {
    if (!selectedPost) {
      alert('Please select a post to like');
      return;
    }
    
    setIsRunning(true);
    // Here you would integrate with your backend API
    // Example payload: { postId: selectedPost }
    
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
          <h1 className="text-2xl font-bold text-gray-900">Bulk Like</h1>
          <p className="text-gray-600">Search for users and select a specific post to like automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Selection */}
          <div className="card p-6">
            <PostSelector
              selectedPost={selectedPost}
              onPostSelect={handlePostSelect}
              onPostDeselect={handlePostDeselect}
              title="Select Post to Like"
              description="Search for IMVU users and select the post you want to like"
            />
          </div>

          {/* Selected Post Summary */}
          {selectedPost && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Selected Post
                </h3>
                <button
                  onClick={clearSelectedPost}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900 font-mono">{selectedPost}</span>
              </div>
            </div>
          )}

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
                    <p className="text-2xl font-bold text-green-600">
                      {selectedPost ? (progress >= 100 ? 1 : 0) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">0</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {selectedPost ? (progress >= 100 ? 0 : 1) : 0}
                    </p>
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
                  <Heart className="w-10 h-10 text-primary-600" />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  {selectedPost ? '1 post' : '0 posts'} selected
                </p>
                <p className="text-xs text-gray-500">
                  Backend will receive: {JSON.stringify({ postId: selectedPost || 'feed_element-example' }, null, 0)}
                </p>
              </div>

              <div className="space-y-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={!selectedPost}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Bulk Like
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
          </div>

          {/* Statistics */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Likes</span>
                <span className="text-sm font-medium text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">94.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Speed</span>
                <span className="text-sm font-medium text-gray-900">12/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkLike;
