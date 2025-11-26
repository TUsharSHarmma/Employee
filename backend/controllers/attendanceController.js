import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

// @desc    Punch in for attendance
// @route   POST /api/attendance/punch-in
// @access  Private
export const punchIn = async (req, res) => {
  try {
    const { plantId, coordinates } = req.body;
    
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID is required'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already punched in today
    const existingAttendance = await Attendance.findOne({
      employee: req.user.id,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Already punched in for today'
      });
    }

    const attendance = await Attendance.create({
      employee: req.user.id,
      date: today,
      punchIn: {
        time: new Date(),
        plant: plantId,
        coordinates
      }
    });

    await attendance.populate(['employee', 'punchIn.plant']);

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Punched in successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Punch out for attendance
// @route   POST /api/attendance/punch-out
// @access  Private
export const punchOut = async (req, res) => {
  try {
    const { plantId, coordinates } = req.body;
    
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID is required'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user.id,
      date: today
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No punch-in found for today'
      });
    }

    if (attendance.punchOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already punched out for today'
      });
    }

    attendance.punchOut = {
      time: new Date(),
      plant: plantId,
      coordinates
    };

    await attendance.save();
    await attendance.populate(['employee', 'punchIn.plant', 'punchOut.plant']);

    res.json({
      success: true,
      data: attendance,
      message: 'Punched out successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
// @desc    Get attendance records
// @route   GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, employeeId } = req.query;
    
    console.log('🔄 TEMPORARY DEBUG - Date filter DISABLED');
    console.log('👤 User:', { id: req.user.id, role: req.user.role });
    console.log('📅 Query params:', { startDate, endDate, employeeId });

    // ✅ TEMPORARY: COMPLETELY REMOVE DATE FILTER
    let query = {};

    // Only keep employee filter for role-based access
    if (req.user.role === 'employee') {
      query.employee = req.user.id;
    } else if (req.user.role === 'admin' && employeeId) {
      query.employee = employeeId;
    }
    // Admin without employeeId sees all records (empty query)

    console.log('🔍 Final query (NO DATE FILTER):', query);
    
    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName email')
      .populate('punchIn.plant', 'name code')
      .populate('punchOut.plant', 'name code')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    console.log('✅ TEMPORARY - Found records:', attendance.length);
    console.log('📊 Records:', attendance);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Backend Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee', 'firstName lastName email')
      .populate('punchIn.plant', 'name code')
      .populate('punchOut.plant', 'name code');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check permissions
    if (req.user.role === 'employee' && attendance.employee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this record'
      });
    }

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
export const updateAttendance = async (req, res) => {
  try {
    const { punchInTime, punchOutTime, punchInPlant, punchOutPlant, notes, reason } = req.body;
    
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check permissions
    if (req.user.role === 'employee' && attendance.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this record'
      });
    }

    const oldData = {
      punchIn: { ...attendance.punchIn.toObject() },
      punchOut: { ...attendance.punchOut.toObject() },
      notes: attendance.notes
    };

    // Update fields
    if (punchInTime) attendance.punchIn.time = new Date(punchInTime);
    if (punchInPlant) attendance.punchIn.plant = punchInPlant;
    if (punchOutTime) attendance.punchOut.time = new Date(punchOutTime);
    if (punchOutPlant) attendance.punchOut.plant = punchOutPlant;
    if (notes !== undefined) attendance.notes = notes;

    // Track edits
    attendance.isEdited = true;
    attendance.editHistory.push({
      editedBy: req.user.id,
      changes: req.body,
      reason: reason || 'No reason provided'
    });

    await attendance.save();
    await attendance.populate(['employee', 'punchIn.plant', 'punchOut.plant']);

    // Send email to admin if edited by employee
    if (req.user.role === 'employee') {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await sendEmail({
          to: admin.email,
          subject: 'Attendance Record Updated',
          html: emailTemplates.attendanceUpdated({
            employeeName: `${req.user.firstName} ${req.user.lastName}`,
            date: attendance.date,
            changes: req.body,
            reason: reason
          })
        });
      }
    }

    res.json({
      success: true,
      data: attendance,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin only for others' records)
export const deleteAttendance = async (req, res) => {
  try {
    const { reason } = req.body;
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check permissions
    if (req.user.role === 'employee' && attendance.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this record'
      });
    }

    // Send email to admin if deleted by employee
    if (req.user.role === 'employee') {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await sendEmail({
          to: admin.email,
          subject: 'Attendance Record Deleted',
          html: emailTemplates.attendanceDeleted({
            employeeName: `${req.user.firstName} ${req.user.lastName}`,
            date: attendance.date,
            reason: reason || 'No reason provided'
          })
        });
      }
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all attendance records (Admin only)
// @route   GET /api/attendance/admin/all
// @access  Private/Admin
export const getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    let query = {};
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName email')
      .populate('punchIn.plant', 'name code')
      .populate('punchOut.plant', 'name code')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
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