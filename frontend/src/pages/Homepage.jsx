import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Clock,
  MapPin,
  BarChart3,
  Shield,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
  LogIn,
  Sparkles,
  TrendingUp,
  Globe,
  Cloud,
  Server,
  Eye
} from 'lucide-react';

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Mouse move effect for interactive background
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  // Enhanced features with more details
  const features = [
    {
      icon: Clock,
      title: 'Smart Attendance',
      description: 'AI-powered automated punch in/out system with facial recognition, geolocation tracking, and real-time monitoring.',
      color: 'blue',
      highlights: ['Facial Recognition', 'GPS Tracking', 'Real-time Alerts', 'Biometric Integration']
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Complete employee lifecycle management from onboarding to offboarding with automated workflows.',
      color: 'green',
      highlights: ['Onboarding Automation', 'Performance Tracking', 'Leave Management', 'Document Storage']
    },
    {
      icon: MapPin,
      title: 'Multi-Plant Support',
      description: 'Manage multiple locations and plants with separate attendance tracking and centralized reporting.',
      color: 'purple',
      highlights: ['Location-based Access', 'Centralized Dashboard', 'Cross-location Reports', 'Zone Management']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'AI-driven insights and comprehensive reports into workforce productivity and attendance patterns.',
      color: 'orange',
      highlights: ['Predictive Analytics', 'Custom Reports', 'Real-time Dashboards', 'Export Capabilities']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade security with role-based access control, end-to-end encryption, and compliance monitoring.',
      color: 'red',
      highlights: ['GDPR Compliant', 'SOC2 Certified', 'Two-Factor Auth', 'Audit Logs']
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Progressive web app with offline capabilities and native-like experience on all devices.',
      color: 'indigo',
      highlights: ['PWA Support', 'Offline Mode', 'Push Notifications', 'Native Features']
    }
  ];

  // Enhanced stats with icons
  const stats = [
    { number: '50+', label: 'Companies Trust Us', icon: Users, trend: '+15%' },
    { number: '10K+', label: 'Employees Managed', icon: TrendingUp, trend: '+2K' },
    { number: '99.9%', label: 'Uptime Reliability', icon: Server, trend: '99.99%' },
    { number: '24/7', label: 'Customer Support', icon: Globe, trend: '<1min' }
  ];

  // Enhanced testimonials with images and more details
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director',
      company: 'TechCorp Inc.',
      content: 'EmployeePro has revolutionized how we manage our workforce. The AI-powered attendance system alone saved us 20 hours per week in manual tracking.',
      rating: 5,
      avatar: 'SJ',
      improvement: '75% faster processing'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      company: 'Manufacturing Plus',
      content: 'The multi-plant support is exceptional. Real-time tracking across all locations helped reduce overtime costs by 30% in the first quarter.',
      rating: 5,
      avatar: 'MC',
      improvement: '30% cost reduction'
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'StartUp Ventures',
      content: 'As a growing company, we needed a scalable solution. EmployeePro grew with us and simplified our HR processes dramatically while maintaining security.',
      rating: 5,
      avatar: 'ER',
      improvement: '50% time saved'
    }
  ];

  // Interactive background gradient based on mouse position
  const interactiveGradient = {
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
      rgba(59, 130, 246, 0.15) 0%, 
      rgba(139, 92, 246, 0.1) 25%, 
      rgba(236, 72, 153, 0.05) 50%, 
      transparent 70%)`
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full bg-gray-900/80 backdrop-blur-xl z-50 transition-all duration-500 border-b border-gray-800 ${
        isVisible ? 'top-0' : '-top-20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/25">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EmployeePro
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Testimonials</a>
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link 
                to="/login" 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Get Started</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <LogIn className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={interactiveGradient}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Enhanced Trust Badge */}
            <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 animate-pulse hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Trusted by 50+ companies worldwide</span>
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
            
            {/* Enhanced Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Employee
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block mt-2">
                Management
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
                System
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your Employee management with our AI-powered comprehensive solution. 
              Track attendance with facial recognition, manage employees across multiple plants, 
              and optimize operations with predictive analytics.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/login" 
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-3">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button className="group border-2 border-gray-600 text-gray-300 px-10 py-5 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-3 backdrop-blur-sm">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="text-center group p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="flex justify-center items-center space-x-2 mb-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                      <div className="text-2xl md:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                    <div className="text-green-400 text-xs font-semibold">{stat.trend}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for Management
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powered by AI and designed for scalability. Everything you need to manage your workforce efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-8 bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className={`relative z-10 w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4 relative z-10">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6 relative z-10">{feature.description}</p>
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600 group-hover:border-blue-400/30 transition-colors duration-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              EmployeePro in 3 Easy Steps
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get your enterprise up and running in under 30 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
            
            {[
              {
                step: 1,
                title: "Sign Up & Setup",
                description: "Create your enterprise account with SSO support and configure your company profile in minutes.",
                icon: Cloud,
                color: "blue"
              },
              {
                step: 2,
                title: "Add Your Team",
                description: "Bulk import employees, set up organizational hierarchy, and configure role-based permissions.",
                icon: Users,
                color: "green"
              },
              {
                step: 3,
                title: "Go Live",
                description: "Deploy to your workforce with our mobile apps and start tracking in real-time immediately.",
                icon: Zap,
                color: "purple"
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group relative">
                  <div className="relative inline-block">
                    <div className={`w-24 h-24 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-${step.color}-500/25 relative z-10`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className={`w-12 h-12 bg-${step.color}-500/20 text-${step.color}-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold`}>
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of companies transforming their workforce management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative overflow-hidden"
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="text-green-400 text-sm font-semibold flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{testimonial.improvement}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of employee management with AI-powered insights and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/login" 
              className="group bg-white text-blue-600 px-12 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-3"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group border-2 border-white text-white px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-3 backdrop-blur-sm">
              <Eye className="h-5 w-5" />
              <span>Live Demo</span>
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-200 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Enterprise support included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Enhanced Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EmployeePro
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-lg leading-relaxed">
                AI-powered employee management platform that helps enterprises streamline workforce operations, 
                enhance productivity, and ensure compliance with cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Linkedin, Github, Mail].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Product Links */}
            <div>
              <h3 className="font-semibold text-white text-lg mb-6">Product</h3>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Security', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Support Links */}
            <div>
              <h3 className="font-semibold text-white text-lg mb-6">Support</h3>
              <ul className="space-y-4">
                {['Documentation', 'Help Center', 'Contact Us', 'Status', 'Training'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced Bottom Footer */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-lg mb-4 md:mb-0">
              © 2025 EmployeePro. All rights reserved.
            </div>
            <div className="flex space-x-8 text-gray-400 text-lg">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;