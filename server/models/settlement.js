
import mongoose from 'mongoose';
import { emotionsSchema } from './county.js';

// Data structure for settlements
const settlementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sentenceCount: {
        type: Number,
        required: false
    },
    tweetCount: {
        type: Number,
        required: true
    },
    emotions: {
        type: emotionsSchema,
        required: true
    }
});


const Settlement = mongoose.model('Settlement', settlementSchema);

export default Settlement;