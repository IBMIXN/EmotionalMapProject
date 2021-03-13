import fetch from 'node-fetch' // used to access the Twitter API

const reqHeaders = new fetch.Headers([['authorization', `Bearer ${process.env.TWITTER_API_BEARER_TOKEN}`]])
const reqInit = {
  method: 'GET',
  headers: reqHeaders
}

async function getTweets (settlement) {
  const hashtags = {}
  const name = settlement.name
  const tweetTexts = []
  /* the text of Tweets are stored in multiple arrays
       that are keyed by the settlement name */
  let pageSize = Math.min(settlement.sample_size, 100)
  /* this cannot change for repeated requests for the same settlement,
       so if more than 100 Tweets are needed, all requests will be for
       100 Tweets but not all Tweets from the response will be stored */
  const url = 'https://api.twitter.com/1.1/search/tweets.json'
  let query = `?result_type=recent&geocode=${settlement.geocode}&count=${pageSize}&include_entities=true&tweet_mode=extended&lang=en`
  // query is updated in the response of the first request
  let sampleRemaining = settlement.sample_size
  /* multiple requests need to be sent if more than 100 Tweets are
       required for a settlement */
  let attemptsRemaining = 2 // two attempts per individual request
  while (sampleRemaining > 0) {
    try {
      // send a new request to the Twitter API
      console.log(`Requesting ${pageSize} tweets`)
      console.log(url + query)
      const results = await fetch(url + query, reqInit).then(data => data.json())
      // check that the response contains Tweets (before the query is changed)
      if (results.statuses.length === 0) {
        throw new Error('The response contained 0 Tweets.')
      }

      /* extract the Tweets, hashtags and the query
            for the next page of results from results */

      // for each Tweet from this settlement
      for (const status in results.statuses) {
        // get the entire Tweet object
        const statusData = results.statuses[status]
        let tweetText = ''

        if (Object.prototype.hasOwnProperty.call(statusData, 'retweeted_status')) {
          // then it is a retweet
          tweetText = statusData.retweeted_status.full_text
        } else {
          // then it is an original tweet
          tweetText = statusData.full_text
        }
        // now store the Tweet text in the settlement's array
        tweetTexts.push(tweetText)

        // for each hashtag in the Tweet
        for (const hashtag in statusData.entities.hashtags) {
          const hashtagText =
                        statusData.entities.hashtags[hashtag].text
          if (hashtags[hashtagText] === undefined) {
            // if it has not yet been registered
            hashtags[hashtagText] = 1 // add it to the list of hashtags
          } else {
            // if it has already been registered
            hashtags[hashtagText] += 1 // count another occurence of it
          }
        }
      }

      sampleRemaining -= pageSize
      if (sampleRemaining <= 0) {
        break
        /* if sample_size > 100, the last request will still be for
                100 Tweets, but we might not want to store all of them,
                so break as soon as the desired number is met */
      }
      /* change the number of Tweets to fetch if the last request needs
         fewer than 100 */
      pageSize = Math.min(sampleRemaining, 100)
      // override the provided count parameter by placing this earlier
      query = `?count=${pageSize}&` +
                results.search_metadata.next_results.slice(1) +
                '&tweet_mode=extended'
      // the query it provides loses the tweet_mode parameter so reinstate it
      // this request succeeded
      attemptsRemaining = 2 // Now reset the attempts for the next request
    } catch (e) {
      console.log(`Tweets could not by fetched for ${name}. Error: ${e}`)
      attemptsRemaining -= 1
      if (attemptsRemaining === 0) {
        break
        /* the last request for this settlement failed twice.
                Move on to the next settlement -
                we can't try the next page for this settlement because
                that hasn't been returned in the last request */
      }
    }
  }
  return {
    tweets: tweetTexts,
    hashtags: hashtags
  }
}

export default getTweets
