
import mongoose from 'mongoose';

// Data structure for counties
const hashtagSchema = new mongoose.Schema({
  hashtag: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true
  },
});

const Hashtag = mongoose.model('Hashtag', hashtagSchema);


export default Hashtag;