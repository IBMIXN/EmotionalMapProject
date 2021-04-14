// import dependencies and initialize express
import express from 'express'
import schedule from 'node-schedule'
import { connectDb } from './models/index.js'

import { refresh } from './processing/index.js'
import County from './models/county.js'
import Hashtag from './models/hashtag.js'
import Settlement from './models/settlement.js'
const app = express()

// enable parsing of http request body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// start node server after connecting to database
const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'

connectDb().then(() => {
  console.log('Database connected')

  app.listen(PORT, HOST, () => {
    console.log(`API available http://${HOST}:${PORT}`)
  })

  // Schedule getTweets every day at midnight

  // Using cron-style
  // schedule.scheduleJob('0 0 * * *', () => {
  //   refresh()
  // })

  const rule = new schedule.RecurrenceRule()
  rule.hour = 0
  rule.minute = 0
  rule.tz = 'Europe/London'

  schedule.scheduleJob(rule, function(){
    refresh()
  });
})

// path for accessing emotion data
app.get('/counties', async (req, res) => {
  console.log('Request: Fetching counties')
  const counties = await County.find().populate('settlements').then((docs) => docs.reduce((acc, it) => { acc[it.name] = it; return acc }, {}))
  res.json(counties)
})

app.get('/hashtags', async (req, res) => {
  console.log('Request: Fetching hashtags')
  const hashtags = await Hashtag.find().sort({ count: -1 }).limit(10)
  res.json(hashtags)
})

app.get('/joyfulsettlements', async (req, res) => {
  console.log('Request: Fetching Joyful Settlements')
  const hashtags = await Settlement.find().sort({ 'emotions.joy': -1 }).limit(10)
  res.json(hashtags)
})

app.get('/breakdown', async (req, res) => {
  console.log('Request: Fetching breakdown')
  const breakdown = await Settlement.aggregate([{
    $group: {
      _id: null,
      joy: {
        $sum: '$emotions.joy'
      },
      fear: {
        $sum: '$emotions.fear'
      },
      anger: {
        $sum: '$emotions.anger'
      },
      sadness: {
        $sum: '$emotions.sadness'
      }
    }
  }])
  if (breakdown[0]) {
    res.json({
      joy: breakdown[0].joy,
      fear: breakdown[0].fear,
      anger: breakdown[0].anger,
      sadness: breakdown[0].sadness
    })
  } else {
    res.json({
      joy: 0,
      fear: 0,
      anger: 0,
      sadness: 0
    })
  }
})

// app.get('/refresh', async (req, res) => {
//   refresh()
//   res.send('Refreshing - check logs')
// })
