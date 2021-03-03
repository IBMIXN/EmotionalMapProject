import mongoose from 'mongoose';

import County from './county.js';

const connectDb = () => {
  return mongoose.connect(`mongodb://mongodb:27017/emotionmap`, {
    "authSource": "admin",
    "user": process.env.MONGO_INITDB_ROOT_USERNAME,
    "pass": process.env.MONGO_INITDB_ROOT_PASSWORD,
});
};

const models = { County };

export { connectDb };

export default models;