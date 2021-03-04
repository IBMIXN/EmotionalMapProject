
import mongoose from 'mongoose';

// Data structure for emotions
const emotionsSchema = new mongoose.Schema({
  joy: {
    type: Number,
    required: true
  },
  fear: {
    type: Number,
    required: true
  },
  anger: {
    type: Number,
    required: true
  },
  sadness: {
    type: Number,
    required: true
  },
});


// Data structure for counties
const countySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  emotions: {
    type: emotionsSchema,
    required: false
  },
  settlements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Settlement' }]
});

const County = mongoose.model('County', countySchema);

export { emotionsSchema }

export default County;