import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Check, Send } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    setEmailError(error);
    
    if (!error) {
      setIsLoading(true);
      // TODO: Implement forgot password logic when backend is ready
      setTimeout(() => {
        console.log('Forgot password request for:', email);
        setIsLoading(false);
        setIsSubmitted(true);
      }, 2000);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(validateEmail(e.target.value));
    }
  };

  if (isSubmitted) {
    return (      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Check Your Email
            </h1>
            <p className="text-gray-400 text-lg">We've sent a reset link to your inbox</p>
          </div>

          {/* Success Message */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400 text-sm font-medium">
                  Reset link sent to <span className="font-bold">{email}</span>
                </p>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Didn't receive the email? Check your spam folder or wait a few minutes before trying again.
              </p>
              
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setEmailError('');
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Try Different Email
                </button>
                  <Link 
                  to="/login" 
                  className="block w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative mb-6">            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
            Reset Password
          </h1>
          <p className="text-gray-400 text-lg">Enter your email to receive a reset link</p>
        </div>

        {/* Reset Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  required
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    emailError
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-400">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <Link 
              to="/login" 
              className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
