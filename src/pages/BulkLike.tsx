import React, { useState } from 'react';
import { Heart, Play, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import PostSelector from '../components/PostSelector';
import { useBulkLike } from '../hooks/useBulkLike';

const BulkLike: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { 
    isRunning, 
    results, 
    error, 
    completed, 
    successCount, 
    failedCount, 
    startBulkLike, 
    reset 
  } = useBulkLike();
  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
    reset(); // Reset previous results when selecting a new post
  };

  const handlePostDeselect = () => {
    setSelectedPost(null);
    reset();
  };

  const clearSelectedPost = () => {
    setSelectedPost(null);
    reset();
  };

  const handleStart = async () => {
    if (!selectedPost) {
      alert('Please select a post to like');
      return;
    }
    
    await startBulkLike(selectedPost);
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
              </div><div className="space-y-3">
                <button
                  onClick={handleStart}
                  disabled={!selectedPost || isRunning}
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
                      Start Bulk Like
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
          </div>          {/* Results Panel */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Operation Results</h3>
            {!isRunning && !completed && !error ? (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">
                  <Heart className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">Results will appear here after starting bulk like operation</p>
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
                    <span className="text-blue-700">Processing bulk like operation...</span>
                  </div>
                )}

                {completed && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700">Bulk like operation completed!</span>
                  </div>
                )}
                
                {(completed || isRunning) && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{successCount}</p>
                      <p className="text-sm text-gray-600">Liked</p>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkLike;
