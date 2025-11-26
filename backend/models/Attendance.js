import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    set: function(date) {
      // Sirf date store karega, time nahi
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    }
  },
  punchIn: {
    time: {
      type: Date,
      required: true,
      validate: {
        validator: function(time) {
          return time <= new Date();
        },
        message: 'Punch-in time cannot be in future'
      }
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  punchOut: {
    time: {
      type: Date,
      validate: {
        validator: function(time) {
          if (!time) return true;
          return time > this.punchIn.time && time <= new Date();
        },
        message: 'Punch-out must be after punch-in and cannot be in future'
      }
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  totalHours: {
    type: Number,
    min: 0,
    max: 24
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: Object,
    reason: String
  }]
}, {
  timestamps: true
});

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Calculate total hours and status
attendanceSchema.pre('save', function(next) {
  if (this.punchIn.time && this.punchOut.time && this.punchOut.time > this.punchIn.time) {
    const diff = this.punchOut.time - this.punchIn.time;
    this.totalHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
    
    // Auto status based on hours
    if (this.totalHours >= 8) {
      this.status = 'present';
    } else if (this.totalHours >= 4) {
      this.status = 'half-day';
    } else {
      this.status = 'absent';
    }
  } else {
    this.totalHours = 0;
    if (this.punchIn.time && !this.punchOut.time) {
      this.status = 'present'; // Still working
    }
  }
  next();
});

// Virtual for formatted date
attendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

attendanceSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Attendance', attendanceSchema);