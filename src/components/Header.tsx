import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User profile */}
          <div className="relative" ref={userMenuRef}>
            {isLoading ? (
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="hidden sm:block">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user?.firstName && user?.lastName ? getInitials(user.firstName, user.lastName) : 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
                    </p>                    <p className="text-xs text-gray-500">
                      {user?.Plan || user?.plan || 'free'} Plan
                    </p>
                  </div>
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add profile navigation here if needed
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
