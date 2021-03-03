// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
/* eslint-disable no-unused-vars */


const fetch = require('node-fetch'); // used to access the Twitter API
const fs = require('fs'); // used to write JSON files for Tweets and hashtags.
// We may stop using this once we can feed them straight into the tone analyser
const settlements = require('./abridged_settlements.json');
// change to 'settlements.json' once the file has been completed
const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// functions
async function getTweets() {
  var tweet_texts = {};
  var hashtags = {};

  // TODO: add key
  const reqHeaders = new fetch.Headers([['authorization', 'Bearer ' ]]);

  const reqInit = {
    method: 'GET',
    headers: reqHeaders,
  };
  for (var key in settlements) {
    let name = settlements[key].name;
    tweet_texts[name] = [];
    /* the text of Tweets are stored in multiple arrays
       that are keyed by the settlement name */
    let page_size = Math.min(settlements[key].sample_size, 100);
    /* this cannot change for repeated requests for the same settlement,
       so if more than 100 Tweets are needed, all requests will be for
       100 Tweets but not all Tweets from the response will be stored */
    let url = 'https://api.twitter.com/1.1/search/tweets.json';
    let query = `?result_type=recent&geocode=${settlements[key].geocode} + 
    &count=${page_size}&include_entities=true&tweet_mode=extended&lang=en`;
    // query is updated in the response of the first request
    let sample_remaining = settlements[key].sample_size;
    /* multiple requests need to be sent if more than 100 Tweets are
       required for a settlement */
    let attempts_remaining = 2; // two attempts per individual request
    while (sample_remaining > 0) {
      try {
        // send a new request to the Twitter API
        const response = await fetch(url + query, reqInit);
        const body = await response.text();
        const results = JSON.parse(body);

        // check that the response contains Tweets (before the query is changed)
        if (results['statuses'].length === 0) {
          throw new Error('The response contained 0 Tweets.');
        }

        /* extract the Tweets, hashtags and the query
        for the next page of results from results */

        /* change the number of Tweets to fetch if the last request needs
        fewer than 100 */
        page_size = Math.min(sample_remaining - 100, 100);
        // override the provided count parameter by placing this earlier
        query = `?count=${page_size}&` +
          results['search_metadata']['next_results'].slice(1) +
          '&tweet_mode=extended';
        // the query it provides loses the tweet_mode parameter so reinstate it

        // for each Tweet from this settlement
        for (let status in results['statuses']) {
          // get the entire Tweet object
          let status_data = results['statuses'][status];
          let tweet_text = '';

          if (status_data.hasOwnProperty('retweeted_status')) {
            // then it is a retweet
            tweet_text = status_data['retweeted_status']['full_text'];
          } else {
            // then it is an original tweet
            tweet_text = status_data['full_text'];
          }
          // now store the Tweet text in the settlement's array
          tweet_texts[name].push(tweet_text);

          // for each hashtag in the Tweet
          for (let hashtag in status_data['entities']['hashtags']) {
            let hashtag_text =
              status_data['entities']['hashtags'][hashtag]['text'];
            if (hashtags[hashtag_text] === undefined) {
              // if it has not yet been registered
              hashtags[hashtag_text] = 1; // add it to the list of hashtags
            } else {
              // if it has already been registered
              hashtags[hashtag_text] += 1; // count another occurence of it
            }
          }

          sample_remaining -= 1;
          if (sample_remaining <= 0) {
            break;
            /* if sample_size > 100, the last request will still be for
            100 Tweets, but we might not want to store all of them,
            so break as soon as the desired number is met */
          }
        }
        // this request succeeded
        attempts_remaining = 2; // Now reset the attempts for the next request
      } catch (e) {
        console.log(`Tweets could not by fetched for ${name}. Error: ${e}`);
        attempts_remaining -= 1;
        if (attempts_remaining === 0) {
          break;
          /* the last request for this settlement failed twice.
          Move on to the next settlement -
          we can't try the next page for this settlement because
          that hasn't been returned in the last request */
        }
      }
    }
  }
  // after data for all settlements has been collected, store them in files:
  let jsonString = JSON.stringify(tweet_texts);
  fs.writeFile('./tweets.json', jsonString, err => {
    if (err) {
      console.log('Error writing file tweets.json', err);
    } else {
      console.log('Successfully wrote file tweets.json');
    }
  });
  jsonString = JSON.stringify(hashtags);
  fs.writeFile('./hashtags.json', jsonString, err => {
    if (err) {
      console.log('Error writing file hashtags.json', err);
    } else {
      console.log('Successfully wrote file hashtags.json');
    }
  });
  return;
}

const getMapData = () => {
  // code to access data from database for use in map
  console.log('ran get map data');
};

const getChartData = () => {
  // code to get data from database for the pie chart
  console.log('ran get chart data');
};

const getHashtagData = () => {
  // code to get data from database for the pie chart
  console.log('ran get hashtag data');
};

const getLeaderboardData = () => {
  // code to get data from database for the leaderboard
  console.log('ran get leaderboard data');
};

// path for accessing map data
app.get('/map', (req, res) => {

  // call getMapData to get data
  // unprocessed_data = getMapData()

  // Then process this data to get it in the correct format as shown below

  // This is placeholder JSON data
  const map_data = {
    counties: {
      // list of all counties
      'Durham': {
        emotions: {
          joy: 0.7,
          fear: 0.2,
          anger: 0.1,
          sadness: 0.2,
        },
        settlements: {
          'City of Durham': {
            joy: 0.7,
            fear: 0.2,
            anger: 0.1,
            sadness: 0.2,
          },
          'Bishop Auckland': {
            joy: 0.3,
            fear: 0.3,
            anger: 0.8,
            sadness: 0.1,
          },
        },
        // within each county is the cities we chose
      },
      Berkshire: {
        emotions: {
          joy: 0.0,
          fear: 0.9,
          anger: 0.9,
          sadness: 0.9,
        },
        settlements: {
          Reading: {
            joy: 0.0,
            fear: 0.9,
            anger: 0.9,
            sadness: 0.9,
          },
          Newbury: {
            joy: 0.9,
            fear: 0.1,
            anger: 0.1,
            sadness: 0.1,
          },
        },
      },
      // ...
    },
  };
  // Send this JSON data to the web page to be displayed
  res.status(200).json(map_data);
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


const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');
app.use(express.static(CLIENT_BUILD_PATH));

app.get('*', function (request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

// start node server
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`API available http://${HOST}:${PORT}`);
});

// this will trigger the function regularly on the specified interval
schedule.scheduleJob('0 0 * * *', () => {
  getTweets();
});

module.exports = app;
