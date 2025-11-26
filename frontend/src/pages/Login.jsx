import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Eye, EyeOff, LogIn, ArrowLeft, Building2, Users, Clock, Shield, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    setError('');
  }, [formData]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
  e.preventDefault();
  setForgotPasswordLoading(true);
  setForgotPasswordMessage('');

  // Basic email validation
  if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
    setForgotPasswordMessage('Please enter a valid email address');
    setForgotPasswordLoading(false);
    return;
  }

  try {
    console.log('Sending forgot password request for:', forgotPasswordEmail);
    
    const response = await authAPI.forgotPassword({ email: forgotPasswordEmail });
    console.log('Forgot password response:', response.data);
    
    if (response.data.success) {
      setForgotPasswordMessage(response.data.message);
      setForgotPasswordEmail('');
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage('');
      }, 5000);
    } else {
      setForgotPasswordMessage(response.data.message || 'Failed to send reset instructions.');
    }
  } catch (error) {
    console.error('Forgot password API error:', error);
    console.error('Error response:', error.response);
    
    setForgotPasswordMessage(
      error.response?.data?.message || 
      error.message ||
      'Network error. Please check your connection and try again.'
    );
  } finally {
    setForgotPasswordLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@company.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'employee@company.com',
        password: 'employee123'
      });
    }
  };

  const features = [
    {
      icon: Clock,
      title: 'Smart Attendance',
      description: 'Track attendance with geolocation and real-time monitoring',
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Complete employee lifecycle management system',
    },
    {
      icon: Building2,
      title: 'Multi-Plant Support',
      description: 'Manage multiple locations with separate tracking',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access',
    }
  ];

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {forgotPasswordMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                forgotPasswordMessage.includes('Failed') 
                  ? 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800'
                  : 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800'
              }`}>
                {forgotPasswordMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="btn-secondary flex-1"
                  disabled={forgotPasswordLoading}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="btn-primary flex-1"
                >
                  {forgotPasswordLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Instructions'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-800 dark:to-dark-900 transition-colors duration-300">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back to Homepage */}
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to homepage
            </Link>

            <div className="card hover:shadow-lg transition-all duration-300 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EmployeePro</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise Management System</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick test with demo accounts:</p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
                  >
                    Admin Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('employee')}
                    className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
                  >
                    Employee Demo
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your email address"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-dark-700 dark:border-dark-600"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full py-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="h-5 w-5" />
                      <span>Sign In to Dashboard</span>
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Contact sales for access
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                EmployeePro &copy; 2024 - Modern Employee Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Features Showcase */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-dark-800 dark:to-dark-900">
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md text-white">
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Streamline Your Workforce Management
                </h2>
                <p className="text-blue-100 dark:text-gray-300 text-lg">
                  Join thousands of companies using EmployeePro to optimize their 
                  employee management and boost productivity.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <div className="p-3 rounded-lg bg-white/20 flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-blue-100 dark:text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-blue-200 dark:text-gray-400 text-sm">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-blue-200 dark:text-gray-400 text-sm">Employees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-blue-200 dark:text-gray-400 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;