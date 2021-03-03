import mongoose from 'mongoose';

import County from './county.js';

const connectDb = () => {
  return mongoose.connect("mongodb://mongodb:27017/emotionmap");
};

const models = { County };

export { connectDb };

export default models;