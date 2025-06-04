import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div><div className="w-full max-w-md relative z-10">
        {/* Header with floating animation */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative mb-6">            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-white text-2xl font-bold">VU</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">Sign in to continue your automation journey</p>
        </div>        {/* Login Form with glassmorphism effect */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-blue-500/0 group-focus-within:from-primary-500/20 group-focus-within:to-blue-500/20 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-200" />                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-blue-500/0 group-focus-within:from-primary-500/20 group-focus-within:to-blue-500/20 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded bg-white/10 border-white/20"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                  Remember me for 30 days
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </div>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              )}
            </button>
          </form>

          {/* Feature highlights */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="group cursor-pointer">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500/30 transition-colors duration-200">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-xs text-gray-400">Secure</p>
              </div>
              <div className="group cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition-colors duration-200">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400">Fast</p>
              </div>
              <div className="group cursor-pointer">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-500/30 transition-colors duration-200">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs text-gray-400">Smart</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Link with enhanced styling */}
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-4">
            New to VU ARABIA?
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl text-white hover:bg-white/5 transition-all duration-300 transform hover:scale-105"
          >
            Create your account
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
