import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, plantsAPI, attendanceAPI } from '../services/api';
import { 
  Users, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPlants: 0,
    todayAttendance: 0,
    presentToday: 0,
    absentToday: 0,
    productivity: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [employeesRes, plantsRes, attendanceRes] = await Promise.all([
        usersAPI.getUsers({ limit: 1000 }),
        plantsAPI.getPlants({ limit: 1000 }),
        attendanceAPI.getAttendance({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          limit: 100
        })
      ]);

      const employees = employeesRes.data.data || [];
      const plants = plantsRes.data.data || [];
      const todayRecords = attendanceRes.data.data || [];

      // Calculate stats
      const presentCount = todayRecords.filter(record => 
        record.status === 'present' || record.punchIn?.time
      ).length;

      const absentCount = employees.length - presentCount;
      const productivity = employees.length > 0 
        ? Math.round((presentCount / employees.length) * 100) 
        : 0;

      setStats({
        totalEmployees: employees.length,
        totalPlants: plants.length,
        todayAttendance: presentCount,
        presentToday: presentCount,
        absentToday: absentCount,
        productivity: productivity
      });

      setTodayAttendance(todayRecords);

      // Generate recent activities from today's attendance
      const activities = todayRecords.slice(0, 6).map(record => ({
        id: record._id,
        user: `${record.employee?.firstName} ${record.employee?.lastName}`,
        action: record.punchOut?.time ? 'Punched out' : 'Punched in',
        time: formatTimeAgo(record.punchOut?.time || record.punchIn?.time),
        type: 'attendance',
        status: record.punchOut?.time ? 'out' : 'in'
      }));

      setRecentActivities(activities);

      // Generate attendance trend (last 7 days - mock data for now)
      setAttendanceTrend(generateAttendanceTrend(employees.length));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceTrend = (totalEmployees) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      present: Math.floor(Math.random() * totalEmployees * 0.8) + Math.floor(totalEmployees * 0.2),
      total: totalEmployees
    }));
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return CheckCircle;
      case 'absent': return XCircle;
      case 'late': return AlertCircle;
      default: return Activity;
    }
  };

  const statsConfig = [
    {
      name: 'Total Employees',
      value: stats.totalEmployees,
      change: '+2 this month',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: 'Active team members'
    },
    {
      name: 'Total Plants',
      value: stats.totalPlants,
      change: '+1 this month',
      changeType: 'positive',
      icon: MapPin,
      color: 'green',
      description: 'Managed locations'
    },
    {
      name: 'Present Today',
      value: stats.presentToday,
      change: `${stats.absentToday} absent`,
      changeType: stats.absentToday > stats.presentToday ? 'negative' : 'positive',
      icon: Clock,
      color: 'purple',
      description: 'Employees present'
    },
    {
      name: 'Productivity',
      value: `${stats.productivity}%`,
      change: stats.productivity > 85 ? 'Excellent' : 'Good',
      changeType: stats.productivity > 85 ? 'positive' : 'neutral',
      icon: TrendingUp,
      color: 'orange',
      description: 'Overall efficiency'
    }
  ];

  const quickActions = [
    {
      name: 'Punch In/Out',
      description: 'Record your attendance',
      icon: Clock,
      path: '/attendance',
      color: 'blue'
    },
    {
      name: 'View Attendance',
      description: 'Check your records',
      icon: Calendar,
      path: '/attendance',
      color: 'green'
    },
    ...(isAdmin ? [
      {
        name: 'Add Employee',
        description: 'Create new account',
        icon: Users,
        path: '/employees',
        color: 'purple'
      },
      {
        name: 'Manage Plants',
        description: 'View all locations',
        icon: MapPin,
        path: '/plants',
        color: 'orange'
      }
    ] : [])
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName} {user?.lastName}! 👋
            </h1>
            <p className="text-primary-100 mt-2">
              {isAdmin 
                ? "Here's an overview of your organization's performance."
                : "Here's your daily summary and quick actions."
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-200 text-sm">Today</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          const ChangeIcon = item.changeType === 'positive' ? ArrowUp : ArrowDown;
          
          return (
            <div
              key={item.name}
              className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-primary-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {item.value}
                  </p>
                  <div className={`flex items-center text-sm font-medium ${
                    item.changeType === 'positive' ? 'text-green-600' : 
                    item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.changeType !== 'neutral' && (
                      <ChangeIcon className="h-4 w-4 mr-1" />
                    )}
                    {item.change}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${item.color}-100`}>
                  <Icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <span className="text-sm text-gray-500">
              Today • {recentActivities.length} activities
            </span>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const StatusIcon = getStatusIcon(activity.status);
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.action}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No activities today</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Today's Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => window.location.href = action.path}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <div className={`p-2 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                      <Icon className={`h-5 w-5 text-${action.color}-600`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-primary-900">
                        {action.name}
                      </p>
                      <p className="text-sm text-gray-500 group-hover:text-primary-700">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Attendance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Present</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.presentToday} employees
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Absent</span>
                <span className="text-sm font-semibold text-red-600">
                  {stats.absentToday} employees
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="text-sm font-semibold text-primary-600">
                  {stats.productivity}%
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Attendance Progress</span>
                <span>{stats.productivity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.productivity}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend Chart (Simple Version) */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Weekly Attendance Trend
          </h3>
          <div className="flex items-end justify-between h-32">
            {attendanceTrend.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="text-xs text-gray-500">{day.day}</div>
                <div 
                  className="w-8 bg-primary-500 rounded-t transition-all duration-500 hover:bg-primary-600"
                  style={{ 
                    height: `${(day.present / day.total) * 80}%`,
                    minHeight: '8px'
                  }}
                  title={`${day.present}/${day.total} present`}
                ></div>
                <div className="text-xs text-gray-400">
                  {Math.round((day.present / day.total) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;