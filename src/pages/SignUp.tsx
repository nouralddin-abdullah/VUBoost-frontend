import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Sparkles, Check, X, Shield, Mail, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return undefined;
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return undefined;
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return undefined;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return undefined;
      default:
        return undefined;
    }
  };
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 2; // Simplified - just check minimum length
    if (password.length >= 8) strength += 1; // Bonus for longer passwords
    if (/(?=.*[a-z])/.test(password)) strength += 1;
    if (/(?=.*[A-Z])/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Special case for confirm password when password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => new Set(prev.add(name)));
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    setErrors(newErrors);
    setTouchedFields(new Set(Object.keys(formData)));    if (Object.keys(newErrors).length === 0 && acceptTerms) {
      setIsLoading(true);
      setApiError(null);

      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setApiError(result.error || 'Registration failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const isFormValid = Object.keys(formData).every(key => 
    !validateField(key, formData[key as keyof typeof formData])
  ) && acceptTerms;

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return (    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
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
            Join VU ARABIA
          </h1>
          <p className="text-gray-400 text-lg">Create your account and start automating</p>
        </div>        {/* Signup Form with glassmorphism effect */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{apiError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="John"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.firstName && touchedFields.has('firstName')
                        ? 'border-red-400 focus:ring-red-400/50'
                        : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                    }`}
                  />
                  {touchedFields.has('firstName') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.firstName ? (
                        <X className="h-5 w-5 text-red-400" />
                      ) : formData.firstName ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : null}
                    </div>
                  )}
                </div>
                {errors.firstName && touchedFields.has('firstName') && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Doe"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.lastName && touchedFields.has('lastName')
                        ? 'border-red-400 focus:ring-red-400/50'
                        : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                    }`}
                  />
                  {touchedFields.has('lastName') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.lastName ? (
                        <X className="h-5 w-5 text-red-400" />
                      ) : formData.lastName ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : null}
                    </div>
                  )}
                </div>
                {errors.lastName && touchedFields.has('lastName') && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email field */}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email && touchedFields.has('email')
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                  }`}
                />
                {touchedFields.has('email') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.email ? (
                      <X className="h-5 w-5 text-red-400" />
                    ) : formData.email ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.email && touchedFields.has('email') && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password && touchedFields.has('password')
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-600'
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Too weak'}
                  </p>
                </div>
              )}
              
              {errors.password && touchedFields.has('password') && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.confirmPassword && touchedFields.has('confirmPassword')
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-white/20 focus:ring-primary-500/50 focus:border-primary-400'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  {touchedFields.has('confirmPassword') && formData.confirmPassword && (
                    <div>
                      {errors.confirmPassword ? (
                        <X className="h-5 w-5 text-red-400" />
                      ) : (
                        <Check className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && touchedFields.has('confirmPassword') && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded bg-white/5 border-white/20"
                />
              </div>
              <label htmlFor="acceptTerms" className="text-sm text-gray-300 leading-5">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300 underline transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300 underline transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors underline"
            >
              Sign in
            </Link>
          </p>
        </div>      </div>
    </div>
  );
};

export default SignUp;
