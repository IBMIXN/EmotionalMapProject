// import dependencies and initialize express
import express from "express";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import models, { connectDb } from './models/index.js';

import { refresh } from "./processing/index.js";
import County from "./models/county.js";
import Hashtag from "./models/hashtag.js";
const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


// path for accessing emotion data
app.get('/counties', async (req, res) => {
  console.log("Request: Fetching counties")
  const counties = await County.find().populate('settlements').then((docs) => docs.reduce((acc, it) => (acc[it.name] = it, acc), {}));
  res.json(counties);
});

app.get('/hashtags', async (req, res) => {
  console.log("Request: Fetching hashtags")
  const counties = await Hashtag.find()
  res.json(counties);
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