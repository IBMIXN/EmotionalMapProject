import getTweets from './tweets.js'
import fs from 'fs' // used to write JSON files for Tweets and hashtags.
import analyseTweets, { initialiseToneAnalyzer } from './tone_analyzer.js'
import Settlement from '../models/settlement.js'
import County from '../models/county.js'
import Hashtag from '../models/hashtag.js'

const sumArrayValues = (values) => {
  return values.reduce((p, c) => p + c, 0)
}

const weightedMean = (factorsArray, weightsArray) => {
  return sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)
}

async function refresh () {
  // Get tweets
  const counties = await fs.promises.readFile('./data/counties.json').then((data, err) => {
    if (err) {
      console.error('Could not find counties file')
      return
    }
    return JSON.parse(data)
  })
  console.log('Counties loaded')

  await County.deleteMany({})
  await Settlement.deleteMany({})
  await Hashtag.deleteMany({})

  initialiseToneAnalyzer()
  for (const [county, settlements] of Object.entries(counties)) {
    const numberOfSettlements = settlements.length
    console.log(`Processing county ${county} with ${numberOfSettlements} settlements`)
    const settlementIds = []
    const hashtagarray = []
    const joy = []
    const fear = []
    const anger = []
    const sadness = []
    const weights = []
    for (const settlement of settlements) {
      try {
        console.log(`Getting tweets for ${county} : ${settlement.name}`)
        const { tweets, hashtags } = await getTweets(settlement)
        hashtagarray.push(hashtags)
        console.log(`Received ${tweets.length} tweets (expected ${settlement.sample_size})`)
        console.log(`Analysing tweets for ${county} : ${settlement.name}`)
        const result = await analyseTweets(tweets, true)
        const emotions = {
          joy: result.happy,
          sadness: result.sad,
          anger: result.anger,
          fear: result.fear
        }
        console.log(`Received ${JSON.stringify(emotions)} for ${county} : ${settlement.name}`)

        joy.push(emotions.joy)
        fear.push(emotions.fear)
        anger.push(emotions.anger)
        sadness.push(emotions.sadness)
        const sentenceCount = Object.is(result.count, undefined) ? 0 : result.count
        weights.push(sentenceCount)

        const addedSettlement = await Settlement.create({
          name: settlement.name,
          sentenceCount: sentenceCount,
          tweetCount: tweets.length,
          emotions: emotions
        })

        settlementIds.push(addedSettlement._id)
      } catch (error) {
        console.error(`Could not process settlement ${settlement.name}`)
      }
    }
    const hashtags = mergeSum(hashtagarray)

    if (weights.length > 0) {
      const countyEmotions = {
        joy: weightedMean(joy, weights),
        sadness: weightedMean(sadness, weights),
        anger: weightedMean(anger, weights),
        fear: weightedMean(fear, weights)
      }

      console.log(`Adding ${county} to database with ${JSON.stringify(countyEmotions)}`)

      await County.create({
        name: county,
        emotions: countyEmotions,
        settlements: settlementIds
      })
    }

    console.log(`Incrementing tally for ${Object.keys(hashtags).length} hashtags`)
    for (const hashtag in hashtags) {
      await Hashtag.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: hashtags[hashtag] } }, { new: true, upsert: true })
    }
    console.log(`${county} done!`)
  }
}

function mergeSum (objectarray) {
  const result = {}
  for (const object of objectarray) {
    for (const [key, value] of Object.entries(object)) {
      if (result[key]) {
        result[key] += value
      } else {
        result[key] = value
      }
    }
  }
  return result
};

export { refresh }
