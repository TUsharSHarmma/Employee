import React, { useState, useEffect } from 'react';
import { attendanceAPI, plantsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  MapPin,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle
} from 'lucide-react';

const Attendance = () => {
  const { user, isAdmin } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editData, setEditData] = useState({
    punchInTime: '',
    punchOutTime: '',
    punchInPlant: '',
    punchOutPlant: '',
    notes: '',
    reason: ''
  });
  
  // Punch Out Plant Selection
  const [selectedPunchOutPlant, setSelectedPunchOutPlant] = useState('');

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    employeeId: ''
  });

  useEffect(() => {
    // Set default dates to today
    const today = new Date().toISOString().split('T')[0];
    setFilters(prev => ({
      ...prev,
      startDate: today,
      endDate: today
    }));
    
    fetchPlants();
  }, []);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchAttendance();
      fetchTodayAttendance();
    }
  }, [filters]);

  const fetchAttendance = async () => {
  try {
    setLoading(true);
    console.log('📋 Fetching attendance with filters:', filters);
    
    const response = await attendanceAPI.getAttendance(filters);
    
    console.log('🔍 COMPLETE API RESPONSE:', response);
    console.log('✅ Response status:', response.status);
    console.log('📊 Response data:', response.data);
    console.log('🎯 Response data.success:', response.data?.success);
    console.log('📝 Response data.data:', response.data?.data);
    console.log('📄 Response data.pagination:', response.data?.pagination);
    
    if (response.data && response.data.success) {
      console.log('✅ Setting attendance data:', response.data.data);
      setAttendance(response.data.data || []);
      setPagination(response.data.pagination || {});
    } else {
      console.error('❌ Invalid response format - success is false');
      console.error('❌ Error message:', response.data?.message);
      setAttendance([]);
      setPagination({});
    }
  } catch (error) {
    console.error('❌ Failed to fetch attendance:', error);
    console.log('🔍 Error response:', error.response);
    console.log('🔍 Error data:', error.response?.data);
    console.log('🔍 Error message:', error.message);
    setAttendance([]);
    setPagination({});
  } finally {
    setLoading(false);
  }
};

  const fetchPlants = async () => {
    try {
      console.log('🔍 Fetching plants...');
      const response = await plantsAPI.getPlants({ limit: 100 });
      console.log('✅ Plants response:', response);
      
      if (response.data && response.data.success) {
        setPlants(response.data.data || []);
      } else {
        console.error('❌ Invalid plants response:', response.data);
        setPlants([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch plants:', error);
      console.log('🔍 Plants error:', error.response?.data);
      setPlants([]);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      console.log('📅 Fetching today attendance for date range:', {
        start: today.toISOString(),
        end: tomorrow.toISOString()
      });
      
      const response = await attendanceAPI.getAttendance({
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
        limit: 10
      });
      
      console.log('✅ Today attendance response:', response.data);
      
      if (response.data && response.data.success) {
        // Find today's record
        const todayRecords = response.data.data || [];
        const todayRecord = todayRecords.find(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          const todayStr = new Date().toISOString().split('T')[0];
          return recordDate === todayStr;
        });
        
        console.log('📊 Today record found:', todayRecord);
        setTodayAttendance(todayRecord || null);
        
        // Set default punch-out plant
        if (todayRecord && !todayRecord.punchOut?.time) {
          setSelectedPunchOutPlant(todayRecord.punchIn.plant?._id || '');
        }
      } else {
        setTodayAttendance(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch today attendance:', error);
      console.log('🔍 Error details:', error.response?.data);
      setTodayAttendance(null);
    }
  };

  const handlePunchIn = async (plantId) => {
    try {
      setPunchLoading(true);
      
      console.log('🔍 Debug - Plant ID received:', plantId);
      
      if (!plantId) {
        alert('Please select a plant');
        return;
      }

      // Frontend validation - check if already punched in
      if (todayAttendance) {
        alert('You have already punched in for today. Please punch out first.');
        return;
      }

      // Get user's current location
      let coordinates = null;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });
        
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('📍 Location captured:', coordinates);
      } catch (geoError) {
        console.warn('🌍 Geolocation failed:', geoError);
        const useLocation = confirm(
          'Location access failed or denied. Do you want to continue without location?'
        );
        if (!useLocation) return;
      }

      console.log('📤 Sending punch-in data...');
      const response = await attendanceAPI.punchIn({
        plantId,
        coordinates
      });
      
      console.log('✅ Punch-in successful:', response.data);
      
      // Refresh data
      await fetchTodayAttendance();
      await fetchAttendance();
      
      alert('Punched in successfully!');
    } catch (error) {
      console.error('❌ Failed to punch in:', error);
      console.log('🔍 Error response:', error.response?.data);
      
      if (error.response?.data?.message?.includes('Already punched in')) {
        // Auto-refresh today's attendance
        fetchTodayAttendance();
        alert('You have already punched in for today. Please punch out first.');
      } else {
        alert(error.response?.data?.message || 'Failed to punch in. Please try again.');
      }
    } finally {
      setPunchLoading(false);
    }
  };

  const handlePunchOut = async (plantId) => {
    try {
      console.log('🔄 Starting punch out for plant:', plantId);
      setPunchLoading(true);
      
      if (!plantId) {
        alert('Please select a plant');
        return;
      }

      // Get user's current location
      let coordinates = null;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });
        
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('📍 Location captured:', coordinates);
      } catch (geoError) {
        console.warn('🌍 Geolocation failed:', geoError);
        const useLocation = confirm(
          'Location access failed or denied. Do you want to continue without location?'
        );
        if (!useLocation) return;
      }

      console.log('📤 Sending punch out request...');
      const response = await attendanceAPI.punchOut({
        plantId,
        coordinates
      });

      console.log('✅ Punch out successful:', response.data);
      
      setSelectedPunchOutPlant('');
      
      // Refresh data
      await fetchTodayAttendance();
      await fetchAttendance();
      
      alert('Punched out successfully!');
    } catch (error) {
      console.error('❌ Failed to punch out:', error);
      console.log('🔍 Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to punch out. Please try again.');
    } finally {
      setPunchLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditData({
      punchInTime: record.punchIn.time ? new Date(record.punchIn.time).toISOString().slice(0, 16) : '',
      punchOutTime: record.punchOut?.time ? new Date(record.punchOut.time).toISOString().slice(0, 16) : '',
      punchInPlant: record.punchIn.plant?._id || '',
      punchOutPlant: record.punchOut?.plant?._id || '',
      notes: record.notes || '',
      reason: ''
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!editData.reason && user.role === 'employee') {
        alert('Please provide a reason for editing');
        return;
      }

      await attendanceAPI.updateAttendance(selectedRecord._id, editData);
      setEditModalOpen(false);
      await fetchAttendance();
      await fetchTodayAttendance();
      alert('Attendance updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update attendance');
    }
  };

  const handleDelete = async (attendanceId) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      const reason = prompt('Please provide a reason for deletion:');
      if (!reason && user.role === 'employee') {
        alert('Reason is required for deletion');
        return;
      }

      await attendanceAPI.deleteAttendance(attendanceId, { reason });
      await fetchAttendance();
      await fetchTodayAttendance();
      alert('Attendance record deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete attendance');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Edit Modal Component
  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Attendance Record</h3>
          <button
            onClick={() => setEditModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Punch In Time</label>
              <input
                type="datetime-local"
                value={editData.punchInTime}
                onChange={(e) => setEditData(prev => ({ ...prev, punchInTime: e.target.value }))}
                className="input-field mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Punch Out Time</label>
              <input
                type="datetime-local"
                value={editData.punchOutTime}
                onChange={(e) => setEditData(prev => ({ ...prev, punchOutTime: e.target.value }))}
                className="input-field mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Punch In Plant</label>
              <select
                value={editData.punchInPlant}
                onChange={(e) => setEditData(prev => ({ ...prev, punchInPlant: e.target.value }))}
                className="input-field mt-1"
              >
                <option value="">Select Plant</option>
                {plants.map(plant => (
                  <option key={plant._id} value={plant._id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Punch Out Plant</label>
              <select
                value={editData.punchOutPlant}
                onChange={(e) => setEditData(prev => ({ ...prev, punchOutPlant: e.target.value }))}
                className="input-field mt-1"
              >
                <option value="">Select Plant</option>
                {plants.map(plant => (
                  <option key={plant._id} value={plant._id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              className="input-field mt-1"
              placeholder="Additional notes..."
            />
          </div>
          
          {(user.role === 'employee' || editData.reason) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Edit {user.role === 'employee' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={editData.reason}
                onChange={(e) => setEditData(prev => ({ ...prev, reason: e.target.value }))}
                className="input-field mt-1"
                placeholder="Please provide a reason for this edit"
                required={user.role === 'employee'}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={() => setEditModalOpen(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Update Record</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage employee attendance</p>
        </div>
      </div>

      {/* Punch In/Out Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {todayAttendance ? (
              <div className="text-right">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">Punched in at {formatTime(todayAttendance.punchIn.time)}</p>
                </div>
                
                {todayAttendance.punchOut?.time ? (
                  <div className="flex items-center space-x-2 text-blue-600 mt-1">
                    <CheckCircle className="h-5 w-5" />
                    <p className="text-sm">Punched out at {formatTime(todayAttendance.punchOut.time)}</p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Ready to punch out?</p>
                    <div className="flex space-x-2">
                      <select
                        className="input-field text-sm"
                        value={selectedPunchOutPlant}
                        onChange={(e) => setSelectedPunchOutPlant(e.target.value)}
                        disabled={punchLoading}
                      >
                        <option value="">Select Punch-out Plant</option>
                        {plants.map(plant => (
                          <option 
                            key={plant._id} 
                            value={plant._id}
                          >
                            {plant.name} {plant._id === todayAttendance.punchIn.plant?._id ? '(Current)' : ''}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handlePunchOut(selectedPunchOutPlant)}
                        disabled={punchLoading || !selectedPunchOutPlant}
                        className="btn-primary text-sm disabled:opacity-50"
                      >
                        {punchLoading ? 'Punching...' : 'Punch Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  className="input-field text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handlePunchIn(e.target.value);
                    }
                  }}
                  disabled={punchLoading}
                >
                  <option value="">Select Plant to Punch In</option>
                  {plants.map(plant => (
                    <option key={plant._id} value={plant._id}>
                      {plant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {todayAttendance && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Punch In</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(todayAttendance.punchIn.time)}
              </p>
              <p className="text-xs text-gray-500">
                {todayAttendance.punchIn.plant?.name}
              </p>
            </div>
            
            {todayAttendance.punchOut?.time && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Punch Out</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatTime(todayAttendance.punchOut.time)}
                </p>
                <p className="text-xs text-gray-500">
                  {todayAttendance.punchOut.plant?.name}
                </p>
              </div>
            )}
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-lg font-semibold text-gray-900">
                {todayAttendance.totalHours || '0'} hrs
              </p>
              <p className="text-xs text-gray-500">Today</p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="input-field mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="input-field mt-1"
            />
          </div>
          
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                placeholder="Employee ID"
                value={filters.employeeId}
                onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                className="input-field mt-1"
              />
            </div>
          )}
          
          <div className="flex items-end">
            <button 
              onClick={fetchAttendance}
              className="btn-primary w-full justify-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Punch In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Punch Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.length > 0 ? (
                    attendance.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {record.employee?.firstName} {record.employee?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.employee?.email}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatTime(record.punchIn.time)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.punchIn.plant?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatTime(record.punchOut?.time)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.punchOut?.plant?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.totalHours || '0'} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(record)}
                              className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                              title="Edit Record"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center">
                        <p className="text-gray-500">No attendance records found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
                    {Math.min(filters.page * filters.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.pages}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && <EditModal />}
    </div>
  );
};

export default Attendance;