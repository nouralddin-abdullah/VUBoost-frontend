import React, { useState } from 'react';
import { Search, User, MapPin, Calendar, Heart, MessageCircle, Loader2, CheckCircle } from 'lucide-react';

interface ImvuUser {
  display_name: string;
  username: string;
  country: string;
  tagline: string;
  legacy_cid: number;
  avatar_image: string;
  thumbnail_url: string;
  personal_feed: string;
}

interface ImvuPost {
  id: string;
  type: string;
  time: string;
  thumbnail_url: string;
  message: string;
  likes_count?: number;
  comments_count?: number;
  feed_element_id: string; // For backend API
}

interface PostSelectorProps {
  selectedPost: string | null;
  onPostSelect: (postId: string) => void;
  onPostDeselect: () => void;
  title?: string;
  description?: string;
}

const PostSelector: React.FC<PostSelectorProps> = ({ 
  selectedPost, 
  onPostSelect, 
  onPostDeselect, 
  title = "Select Post",
  description = "Search for IMVU users and select a post"
}) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [user, setUser] = useState<ImvuUser | null>(null);
  const [posts, setPosts] = useState<ImvuPost[]>([]);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setUser(null);
    setPosts([]);    try {
      // Try multiple CORS proxy services for better reliability
      let data = null;
      let lastError = null;

      // First try: allorigins (primary choice)
      try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = encodeURIComponent(`https://api.imvu.com/user?username=${username.trim()}`);
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        const proxyData = await response.json();
        
        if (!proxyData.contents) {
          throw new Error('No contents in proxy response');
        }
        data = JSON.parse(proxyData.contents);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        lastError = err;
        console.warn('allorigins failed:', err);
        
        // Second try: corsproxy.io (fallback)
        try {
          const proxyUrl = 'https://corsproxy.io/?';
          const targetUrl = encodeURIComponent(`https://api.imvu.com/user?username=${username.trim()}`);
          const response = await fetch(`${proxyUrl}${targetUrl}`);
          data = await response.json();
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (err2) {
          lastError = err2;
          console.warn('corsproxy.io failed:', err2);
          throw err2;
        }
      }

      if (!data) {
        throw lastError || new Error('All CORS proxies failed');
      }

      if (data.status === 'success' && data.denormalized) {
        // Find the user data in the complex nested structure
        const userKeys = Object.keys(data.denormalized).filter(key => key.includes('/user/user-'));
        
        if (userKeys.length > 0) {
          const userData = data.denormalized[userKeys[0]].data;
          const relations = data.denormalized[userKeys[0]].relations;
          
          const imvuUser: ImvuUser = {
            display_name: userData.display_name,
            username: userData.username,
            country: userData.country,
            tagline: userData.tagline || '',
            legacy_cid: userData.legacy_cid,
            avatar_image: userData.avatar_image,
            thumbnail_url: userData.thumbnail_url,
            personal_feed: relations.personal_feed
          };

          setUser(imvuUser);
          
          // Fetch user posts
          if (relations.personal_feed) {
            await fetchUserPosts(relations.personal_feed);
          }
        } else {
          setError('User not found');
        }
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to search user. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };  const fetchUserPosts = async (feedUrl: string) => {
    setLoadingPosts(true);    try {
      // Try multiple CORS proxy services for better reliability
      let data = null;
      let lastError = null;

      // First try: allorigins (primary choice)
      try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = encodeURIComponent(feedUrl);
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        const proxyData = await response.json();
        
        if (!proxyData.contents) {
          throw new Error('No contents in proxy response');
        }
        data = JSON.parse(proxyData.contents);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        lastError = err;
        console.warn('allorigins failed for posts:', err);
        
        // Second try: corsproxy.io (fallback)
        try {
          const proxyUrl = 'https://corsproxy.io/?';
          const targetUrl = encodeURIComponent(feedUrl);
          const response = await fetch(`${proxyUrl}${targetUrl}`);
          data = await response.json();
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (err2) {
          lastError = err2;
          console.warn('corsproxy.io failed for posts:', err2);
          throw err2;
        }
      }

      if (!data) {
        throw lastError || new Error('All CORS proxies failed');
      }

      if (data.status === 'success' && data.denormalized) {
        const posts: ImvuPost[] = [];
        
        // Find feed elements
        const feedElements = Object.keys(data.denormalized).filter(key => 
          key.includes('/feed_element/feed_element-')
        );

        feedElements.forEach(elementKey => {
          const elementData = data.denormalized[elementKey];
          if (elementData.data && elementData.data.type === 'photo') {
            const payload = elementData.data.payload;
            
            // Extract feed_element ID for backend API
            const feedElementId = elementKey.split('/').pop() || '';
            
            // Get like and comment counts if available
            const likesKey = Object.keys(data.denormalized).find(key => 
              key.includes(feedElementId + '/liked_by_profile?limit=0')
            );
            const commentsKey = Object.keys(data.denormalized).find(key => 
              key.includes(feedElementId + '/comments?limit=0')
            );

            const likesCount = likesKey ? data.denormalized[likesKey].data?.total_count : 0;
            const commentsCount = commentsKey ? data.denormalized[commentsKey].data?.total_count : 0;

            posts.push({
              id: elementKey,
              type: elementData.data.type,
              time: elementData.data.time,
              thumbnail_url: payload.thumbnail_url ? `https:${payload.thumbnail_url}` : '',
              message: payload.message || '',
              likes_count: likesCount,
              comments_count: commentsCount,
              feed_element_id: feedElementId
            });
          }
        });

        // Sort posts by time (newest first)
        posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setPosts(posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };
  const togglePostSelection = (post: ImvuPost) => {
    if (selectedPost === post.feed_element_id) {
      onPostDeselect();
    } else {
      onPostSelect(post.feed_element_id);
      setError('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        {selectedPost && (
          <p className="text-sm text-blue-600 mt-1">
            1 post selected
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter IMVU username (e.g., 0R3D)"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={searchUser}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
        
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={user.thumbnail_url || user.avatar_image}
                alt={user.display_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=User';
                }}
              />
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{user.display_name}</h4>
              <p className="text-primary-600 text-sm">@{user.username}</p>
              
              <div className="flex items-center gap-4 text-gray-500 text-xs mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.country || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>ID: {user.legacy_cid}</span>
                </div>
              </div>
              
              {user.tagline && (
                <p className="text-gray-600 text-sm bg-gray-50 rounded p-2 mt-2 italic">
                  "{user.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      {user && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Select Posts ({posts.length} available)
          </h4>
          
          {loadingPosts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              <span className="ml-2 text-gray-600">Loading posts...</span>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">              {posts.map((post) => {
                const isSelected = selectedPost === post.feed_element_id;
                return (
                  <div 
                    key={post.id} 
                    className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => togglePostSelection(post)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {post.thumbnail_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={post.thumbnail_url}
                            alt="Post"
                            className="w-16 h-16 rounded-md object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(post.time)}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {post.likes_count !== undefined && (
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{post.likes_count}</span>
                              </div>
                            )}
                            {post.comments_count !== undefined && (
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{post.comments_count}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {post.message && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {post.message}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {post.feed_element_id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No posts found for this user</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostSelector;
