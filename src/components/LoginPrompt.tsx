import React from 'react';
import { LogIn, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  isVisible, 
  onClose, 
  message = "You need to be logged in to start bulk operations." 
}) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm !mt-0">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl mx-4 max-w-md w-full !mt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <LogIn className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Login Required</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          {message}
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={handleLogin}
            className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Now</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl font-medium transition-colors duration-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
