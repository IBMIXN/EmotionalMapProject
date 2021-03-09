// import dependencies and initialize express
import express from "express";
import schedule from "node-schedule";
import models, { connectDb } from './models/index.js';

import { refresh } from "./processing/index.js";
import County from "./models/county.js";
import Hashtag from "./models/hashtag.js";
import Settlement from "./models/settlement.js";
const app = express();

// enable parsing of http request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// start node server after connecting to database
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

connectDb().then(() => {
  console.log(`Database connected`);

  app.listen(PORT, HOST, () => {
    console.log(`API available http://${HOST}:${PORT}`);
  });

  // Schedule getTweets every day at midnight
  schedule.scheduleJob('0 0 * * *', () => {
    // refresh();
  });
})

const sumArrayValues = (values) => {
  return values.reduce((p, c) => p + c, 0)
}

const weightedMean = (factorsArray, weightsArray) => {
  return sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)
}

// path for accessing emotion data
app.get('/counties', async (req, res) => {
  console.log("Request: Fetching counties")
  const counties = await County.find().lean().populate('settlements').then((docs) => docs.reduce((acc, it) => (acc[it.name] = it, acc), {}));
  console.log(counties);
  for (let county of Object.values(counties)) {
    const joy = [];
    const fear = [];
    const anger = [];
    const sadness = [];
    const weights = [];
    for (let settlement of Object.values(county.settlements)) {
      joy.push(settlement.emotions.joy)
      fear.push(settlement.emotions.joy)
      anger.push(settlement.emotions.joy)
      sadness.push(settlement.emotions.joy)
      weights.push(settlement.sentenceCount)
    }
    county.emotions.joy = weightedMean(joy, weights)
    county.emotions.fear = weightedMean(fear, weights)
    county.emotions.anger = weightedMean(anger, weights)
    county.emotions.sadness = weightedMean(sadness, weights)
  }
  res.json(counties);
});

app.get('/hashtags', async (req, res) => {
  console.log("Request: Fetching hashtags")
  const hashtags = await Hashtag.find().sort({ count: -1 }).limit(10)
  res.json(hashtags);
});

app.get('/joyfulsettlements', async (req, res) => {
  console.log("Request: Fetching Joyful Settlements")
  const hashtags = await Settlement.find().sort({ 'emotions.joy': -1 }).limit(10)
  res.json(hashtags);
});

app.get('/breakdown', async (req, res) => {
  console.log("Request: Fetching breakdown")
  const breakdown = await Settlement.aggregate([{
    "$group": {
      _id: null,
      "joy": {
        $sum: "$emotions.joy"
      },
      "fear": {
        $sum: "$emotions.fear"
      },
      "anger": {
        $sum: "$emotions.anger"
      },
      "sadness": {
        $sum: "$emotions.sadness"
      }
    }
  }])
  res.json({
    joy: breakdown[0].joy,
    fear: breakdown[0].fear,
    anger: breakdown[0].anger,
    sadness: breakdown[0].sadness,
  });
});

app.get('/refresh', async (req, res) => {
  refresh();
  res.send("Refreshing - check logs");
});

// path for getting pie chart data
app.get('/piechart', (req, res) => {
  // unprocessed_data = getChartData()

  // process this data to get it into the following JSON format
  const chart_data = {
    joy: 0.7,
    fear: 0.2,
    anger: 0.1,
    sadness: 0.2,
  };

  // send this data to the web page
  res.status(200).json(chart_data);
});

// path for hashtags data
app.get('/hashtags', (req, res) => {
  // unprocessed_data = getHashtagData()

  // process this data to get it in the following JSON format
  const hashtag_data = {
    // hashtag: number of uses
    '#Biden': 543,
    '#Lockdown': 432,
    '#TRUMP': 213,
    '#Snow': 123,
  };

  // send this data to the web page
  res.status(200).json(hashtag_data);
});

// path for leaderboard data
app.get('/leaderboard', (req, res) => {
  // unprocessed_data = getLeaderboardData()

  // process this data to be put in the following JSON format

  const leaderboard_data = ['London', 'Reading'];

  // send the data to the web page
  res.status(200).json(leaderboard_data);
});