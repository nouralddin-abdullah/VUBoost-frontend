import React, { useState } from 'react';
import { Search, User, MapPin, Loader2, X } from 'lucide-react';

interface ImvuUser {
  display_name: string;
  username: string;
  country: string;
  tagline: string;
  legacy_cid: number;
  avatar_image: string;
  thumbnail_url: string;
}

interface UserSelectorProps {
  selectedUsers?: ImvuUser[];
  selectedUser?: ImvuUser | null;
  onUserAdd: (user: ImvuUser) => void;
  onUserRemove: (userId?: number) => void;
  title?: string;
  description?: string;
  singleSelection?: boolean;
}

const UserSelector: React.FC<UserSelectorProps> = ({ 
  selectedUsers, 
  selectedUser,
  onUserAdd, 
  onUserRemove, 
  title = "Search Users",
  description = "Search for IMVU users to add to your target list",
  singleSelection = false
}) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<ImvuUser | null>(null);
  const [error, setError] = useState('');

  // Get the current selection count
  const getSelectionCount = () => {
    if (singleSelection) {
      return selectedUser ? 1 : 0;
    }
    return selectedUsers?.length || 0;
  };

  // Check if a user is already selected
  const isUserSelected = (userToCheck: ImvuUser) => {
    if (singleSelection) {
      return selectedUser?.legacy_cid === userToCheck.legacy_cid;
    }
    return selectedUsers?.some(u => u.legacy_cid === userToCheck.legacy_cid) || false;
  };

  const searchUser = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setUser(null);

    try {
      // Try multiple CORS proxy services for better reliability
      let data = null;
      let lastError = null;

      // First try: corsproxy.io
      try {
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = encodeURIComponent(`https://api.imvu.com/user?username=${username.trim()}`);
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        data = await response.json();
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        lastError = err;
        console.warn('corsproxy.io failed:', err);
        
        // Second try: allorigins (different format)
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
        } catch (err2) {
          lastError = err2;
          console.warn('allorigins failed:', err2);
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
          
          const imvuUser: ImvuUser = {
            display_name: userData.display_name,
            username: userData.username,
            country: userData.country,
            tagline: userData.tagline || '',
            legacy_cid: userData.legacy_cid,
            avatar_image: userData.avatar_image,
            thumbnail_url: userData.thumbnail_url
          };

          setUser(imvuUser);
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };
  const handleAddUser = () => {
    if (user) {
      // Check if user is already selected
      if (!isUserSelected(user)) {
        onUserAdd(user);
        setUser(null);
        setUsername('');
        setError('');
      } else {
        setError('User is already selected');
      }
    }
  };

  return (
    <div className="space-y-6">      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        {getSelectionCount() > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            {singleSelection ? '1 user selected' : `${getSelectionCount()} user${getSelectionCount() !== 1 ? 's' : ''} added`}
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
            
            <div className="flex-shrink-0">
              <button
                onClick={handleAddUser}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}      {/* Selected Users List */}
      {!singleSelection && selectedUsers && selectedUsers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-900">
              Target Users ({selectedUsers.length})
            </h4>
            <button
              onClick={() => selectedUsers.forEach(u => onUserRemove(u.legacy_cid))}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedUsers.map((user) => (
              <div key={user.legacy_cid} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <img
                  src={user.thumbnail_url || user.avatar_image}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32x32?text=U';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.display_name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
                <button
                  onClick={() => onUserRemove(user.legacy_cid)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected User Display for Single Selection */}
      {singleSelection && selectedUser && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-900">Selected User</h4>
            <button
              onClick={() => onUserRemove()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <img
              src={selectedUser.thumbnail_url || selectedUser.avatar_image}
              alt={selectedUser.display_name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=U';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedUser.display_name}</p>
              <p className="text-xs text-gray-500">@{selectedUser.username}</p>
            </div>
            <button
              onClick={() => onUserRemove()}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
