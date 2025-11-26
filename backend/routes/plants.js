import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant
} from '../controllers/plantController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// === PUBLIC ROUTES (For all authenticated users) ===
router.get('/', getPlants); // ✅ Admin AND Employee dono access kar sakte hain

// === ADMIN ONLY ROUTES ===  
router.post('/', authorize('admin'), createPlant);
router.get('/:id', authorize('admin'), getPlant);
router.put('/:id', authorize('admin'), updatePlant);
router.delete('/:id', authorize('admin'), deletePlant);

export default router;