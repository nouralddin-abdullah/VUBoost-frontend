import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Users, 
  Settings, 
  BarChart3,
  Home,
  Activity,
  MessageSquare
} from 'lucide-react';
import type { NavItem } from '../types';

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
    description: 'Overview and statistics'
  },
  {
    id: 'bulk-like',
    label: 'Bulk Like',
    icon: Heart,
    path: '/services/bulk-like',
    description: 'Mass like posts and profiles'
  },
  {
    id: 'bulk-comment',
    label: 'Bulk Comment',
    icon: MessageCircle,
    path: '/services/bulk-comment',
    description: 'Automated commenting on posts'
  },  {
    id: 'bulk-follow',
    label: 'Bulk Follow',
    icon: UserPlus,
    path: '/services/bulk-follow',
    description: 'Mass follow users'
  },
  {
    id: 'account-manager',
    label: 'Spam Rooms',
    icon: Users,
    path: '/accounts',
    description: 'Make rooms full'
  },  {
    id: 'plans',
    label: 'Plans',
    icon: BarChart3,
    path: '/plans',
    description: 'Basic & Premium subscription plans'
  },
  {
    id: 'activity-log',
    label: 'Activity Log',
    icon: Activity,
    path: '/activity',
    description: 'Recent automation activities'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    description: 'Configure automation settings'
  }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VU</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">VU ARABIA</h1>
                <p className="text-xs text-gray-500">IMVU Automation</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    sidebar-item group relative
                    ${isActive ? 'active' : ''}
                  `}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </nav>          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <a
              href="https://discord.gg/bBWAKqfyvC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-indigo-700 group-hover:text-indigo-800">Join Our Discord</p>
                <p className="text-xs text-indigo-600 group-hover:text-indigo-700">Connect with the community</p>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
