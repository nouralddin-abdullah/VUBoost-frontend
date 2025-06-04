import React, { useState } from 'react';
import { MessageCircle, Play, Pause, Trash2 } from 'lucide-react';
import PostSelector from '../components/PostSelector';

const BulkComment: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [progress, setProgress] = useState(0);

  const predefinedComments = [
    "Great post! 👍",
    "Love this! ❤️",
    "Amazing content!",
    "So cool! 🔥",
    "Awesome! 😍",
    "Beautiful! ✨",
    "Nice work! 💪",
    "Incredible! 🤩"
  ];

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
      alert('Please select a post to comment on');
      return;
    }
    
    if (!comments.trim()) {
      alert('Please add at least one comment message');
      return;
    }
    
    setIsRunning(true);
    // Here you would integrate with your backend API
    // Example payload: { postId: selectedPost, comment: randomComment }
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 8;
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const addPredefinedComment = (comment: string) => {
    setComments(prev => prev ? `${prev}\n${comment}` : comment);
  };

  const getCommentsArray = () => {
    return comments.split('\n').filter(c => c.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>          <h1 className="text-2xl font-bold text-gray-900">Bulk Comment</h1>
          <p className="text-gray-600">Search for users, select a post, and add comments automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">          {/* Post Selection */}
          <div className="card p-6">
            <PostSelector
              selectedPost={selectedPost}
              onPostSelect={handlePostSelect}
              onPostDeselect={handlePostDeselect}
              title="Select Post to Comment On"
              description="Search for IMVU users and select the post you want to comment on"
            />
          </div>

          {/* Comments Configuration */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comments Setup</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment Messages ({getCommentsArray().length} configured)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter comment messages (one per line)&#10;The system will randomly select from these comments&#10;Example:&#10;Great post! 👍&#10;Love this! ❤️&#10;Amazing content!"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Add Predefined Comments
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedComments.map((comment, index) => (
                    <button
                      key={index}
                      onClick={() => addPredefinedComment(comment)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-150"
                    >
                      {comment}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>          {/* Selected Post Summary */}
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
                    <p className="text-sm text-gray-600">Posted</p>
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
                  <MessageCircle className="w-10 h-10 text-primary-600" />
                </div>
              </div>
                <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  {getCommentsArray().length} comment{getCommentsArray().length !== 1 ? 's' : ''} configured
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPost ? '1 post' : '0 posts'} selected
                </p>
                <p className="text-xs text-gray-500">
                  Backend will receive: {JSON.stringify({ postId: selectedPost || 'feed_element-example', comment: getCommentsArray()[0] || 'Great post!' }, null, 0)}
                </p>
              </div>

              <div className="space-y-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={!selectedPost || !comments.trim()}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Bulk Comment
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
                <span className="text-sm text-gray-600">Comments Posted</span>
                <span className="text-sm font-medium text-gray-900">287</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">91.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Speed</span>
                <span className="text-sm font-medium text-gray-900">6/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkComment;
