import Plant from '../models/Plant.js';

// @desc    Get all plants
// @route   GET /api/plants
// @access  Private/Admin
export const getPlants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by city
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const plants = await Plant.find(query)
      .populate('manager', 'firstName lastName email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Plant.countDocuments(query);

    res.json({
      success: true,
      data: plants,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Private/Admin
export const getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id)
      .populate('manager', 'firstName lastName email');

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create plant
// @route   POST /api/plants
// @access  Private/Admin
export const createPlant = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      description,
      manager,
      contact,
      coordinates
    } = req.body;

    // Check if plant code exists
    const plantExists = await Plant.findOne({ code });
    if (plantExists) {
      return res.status(400).json({
        success: false,
        message: 'Plant already exists with this code'
      });
    }

    const plant = await Plant.create({
      name,
      code: code.toUpperCase(),
      address,
      description,
      manager,
      contact,
      coordinates
    });

    await plant.populate('manager', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: plant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private/Admin
export const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('manager', 'firstName lastName email');

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete plant
// @route   DELETE /api/plants/:id
// @access  Private/Admin
export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};