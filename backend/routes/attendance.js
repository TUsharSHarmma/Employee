import express from 'express';
import { 
  punchIn, 
  punchOut, 
  getAttendance, 
  getAttendanceById,
  updateAttendance, 
  deleteAttendance,
  getAllAttendance
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// === EMPLOYEE ROUTES ===
router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);

// Get attendance with filters (own records for employees, all for admin)
router.get('/', getAttendance);

// Get/Update/Delete specific attendance record (with ownership check)
router.route('/:id')
  .get(getAttendanceById)
  .put(updateAttendance)
  .delete(deleteAttendance);

// === ADMIN ONLY ROUTES ===
router.get('/admin/all', authorize('admin'), getAllAttendance);

export default router;