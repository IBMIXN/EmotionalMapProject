
import mongoose from 'mongoose';

const countySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joy: {
      type: Number,
      required: true
  },
});

const County = mongoose.model('County', countySchema);

export default County;