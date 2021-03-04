import mongoose from 'mongoose';
import './plugins.js'
import County from './county.js';
import Settlement from './settlement.js';
import Hashtag from './hashtag.js'

// Connect to the database with the admin account
const connectDb = () => {
  return mongoose.connect(`mongodb://mongodb:27017/emotionmap`, {
    "authSource": "admin",
    "user": process.env.MONGO_INITDB_ROOT_USERNAME,
    "pass": process.env.MONGO_INITDB_ROOT_PASSWORD,
    "useFindAndModify": false
  });
};

const models = { County, Settlement, Hashtag };

export { connectDb };

export default models;