
import mongoose from 'mongoose';


const settlementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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

const countySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  settlements: [settlementSchema]
});

const County = mongoose.model('County', countySchema);

export default County;