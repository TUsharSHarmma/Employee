import React, { useState, useEffect } from 'react';
import { plantsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building
} from 'lucide-react';

const PlantManagement = () => {
  const { isAdmin } = useAuth();
  const [plants, setPlants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    country: ''
  });

  useEffect(() => {
    fetchPlants();
    fetchManagers();
  }, [filters]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await plantsAPI.getPlants(filters);
      setPlants(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await usersAPI.getUsers({ role: 'admin', limit: 100 });
      setManagers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleAddPlant = async (plantData) => {
    try {
      await plantsAPI.createPlant(plantData);
      setShowAddModal(false);
      fetchPlants();
    } catch (error) {
      console.error('Failed to add plant:', error);
    }
  };

  const handleEditPlant = async (id, plantData) => {
    try {
      await plantsAPI.updatePlant(id, plantData);
      setShowEditModal(false);
      setSelectedPlant(null);
      fetchPlants();
    } catch (error) {
      console.error('Failed to update plant:', error);
    }
  };

  const handleDeletePlant = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await plantsAPI.deletePlant(id);
        fetchPlants();
      } catch (error) {
        console.error('Failed to delete plant:', error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Management</h1>
          <p className="text-gray-600">Manage your plants and locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Plant</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          
        </div>
      </div>

      {/* Plants Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plant.name}
                        </h3>
                        <p className="text-sm text-gray-500">{plant.code}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedPlant(plant);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlant(plant._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {plant.address.street}, {plant.address.city}, {plant.address.state}
                      </span>
                    </div>

                    {plant.contact?.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{plant.contact.phone}</span>
                      </div>
                    )}

                    {plant.contact?.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{plant.contact.email}</span>
                      </div>
                    )}

                    {plant.manager && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Manager</p>
                        <p className="text-sm text-gray-600">
                          {plant.manager.firstName} {plant.manager.lastName}
                        </p>
                      </div>
                    )}

                    {plant.description && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{plant.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plant.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {plant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 rounded-xl">
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

      {/* Add Plant Modal */}
      {showAddModal && (
        <AddPlantModal
          managers={managers}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPlant}
        />
      )}

      {/* Edit Plant Modal */}
      {showEditModal && selectedPlant && (
        <EditPlantModal
          plant={selectedPlant}
          managers={managers}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlant(null);
          }}
          onSave={handleEditPlant}
        />
      )}
    </div>
  );
};

// Add Plant Modal Component
const AddPlantModal = ({ managers, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'USA',
      zipCode: ''
    },
    description: '',
    manager: '',
    contact: {
      phone: '',
      email: ''
    },
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean up data
    const submitData = {
      ...formData,
      code: formData.code.toUpperCase(),
      coordinates: {
        latitude: parseFloat(formData.coordinates.latitude) || undefined,
        longitude: parseFloat(formData.coordinates.longitude) || undefined
      }
    };

    await onSave(submitData);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
    } else if (name.startsWith('coordinates.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: { ...prev.coordinates, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Plant</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plant Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plant Code</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="input-field mt-1 uppercase"
                  placeholder="e.g., NY001"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="address.street"
                  required
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="address.state"
                    required
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.country"
                    required
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="address.zipCode"
                    required
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager</label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.firstName} {manager.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Adding...' : 'Add Plant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Plant Modal Component
const EditPlantModal = ({ plant, managers, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: plant.name,
    code: plant.code,
    address: plant.address,
    description: plant.description || '',
    manager: plant.manager?._id || '',
    contact: plant.contact || { phone: '', email: '' },
    isActive: plant.isActive
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(plant._id, formData);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Plant</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plant Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plant Code</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="input-field mt-1 uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="address.street"
                  required
                  value={formData.address.street}
                  onChange={handleChange}
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="address.state"
                    required
                    value={formData.address.state}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.country"
                    required
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="address.zipCode"
                    required
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager</label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.firstName} {manager.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Active Plant</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Updating...' : 'Update Plant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantManagement;