// Needed for Tone Analyzer API
import ToneAnalyzerV3 from 'ibm-watson/tone-analyzer/v3.js'
import { IamAuthenticator } from 'ibm-watson/auth/index.js'

const apikeys = process.env.TONE_ANALYZER_KEYS.split(',')
const urls = process.env.TONE_ANALYZER_URLS.split(',')

let toneAnalyzer
let toneAnalyzerIndex = 0

const linkPattern = /https?:\/\/[\S]*/ // Catches links; while these are almost always t.co links we need to be careful
const hashtagPattern = /[@#][\S]*/ // Catches #hashtags and @Mentions
const linebreak = '---------------------------------------------------------' // Used to delimit tweets

console.log('Tone Analyser set up')

async function analyseTweets (tweets, useSentences = false) {
  /*
    tweets: A list of tweets e.g.
    ["tweet", "tweet"]

    useSentences: A boolean value which represents if you want to do sentence-level analysis (really costly for our quotas!) or document-level analysis (use this one for testing).

    We filter out any bad ones that are just mentions/hashtags, then lump them all together and process them.
    */

  /* Target output is something like:
    {
    "count": 100,
    "happy": 0.1,
    "sad": 0.5,
    "angry": 0.3,
    "fear": 0.1 }
    etc */

  let result = {
    count: 0,
    happy: 0,
    sad: 0,
    anger: 0,
    fear: 0
  }

  let requestBody = ''

  for (const tweet of tweets) {
    let tweetText = tweet.replace('\n', ' ') // Makes analyzing easier later, and doesn't affect the tone
    while (tweetText.includes('\n')) {
      tweetText = tweetText.replace('\n', ' ')
    }
    while (tweetText.search(linkPattern) !== -1) {
      tweetText = tweetText.replace(linkPattern, '')
    }
    while (tweetText.search(hashtagPattern) !== -1) {
      tweetText = tweetText.replace(hashtagPattern, '')
    }
    while (tweetText.search(linebreak) !== -1) { // If a tweet for some reason has -------------... etc in it...
      tweetText = tweetText.replace(linebreak, '')
      // This doesn't actually affect the tones - the analyzer picks up "------------" as its own sentence and assigns it zero tones.
    }
    if (useSentences) {
      if (/\S/.test(tweetText)) { // There's at least 1 non-whitespace character, so analyze it
        requestBody += tweetText
        requestBody += '\n ' + linebreak + '\n'
      };
    } else {
      requestBody += tweetText
    }

    /* Tones have the format:
        { "document-tone": { "tones": [
                { "score" = 0.5, "tone_id" = "sadness", "tone_name" = "Sadness"},
                { "score" = 0.82, "tone_id" = "joy", "tone_name" = "Joy"} ] },
          "sentences-tone": { "sentence-id": 0, "text" = "Analyzed text", "tones": [
                { "score" = 0.5, "tone_id" = "sadness", "tone_name" = "Sadness"},
                { "score" = 0.82, "tone_id" = "joy", "tone_name" = "Joy"} ]}
        }
        So bunging these into a list then extracting the relevant details is doable!
        */
  };
  // Now we've added all the tweets to the list in the correct format
  if (useSentences) {
    let remainingTweets = true
    console.log(`ToneAnalyzer: request body length: ${requestBody.length}`)
    if (requestBody.length <= 0) { // If there's no text to add, don't analyze it
      remainingTweets = false
    };
    while (remainingTweets) {
      // We now have a large string which contains the tweets. So, we send ALL of that data off to the analyzer.
      const tones = await getTone(requestBody, true)
      // Then, we use the data we get and update the emotional rankings.
      const extractedTones = extractTones(tones, true)
      result.count += extractedTones.count
      result.happy += extractedTones.happy
      result.sad += extractedTones.sad
      result.anger += extractedTones.anger
      result.fear += extractedTones.fear

      // We most likely won't get it all back, so we find out how many tweets actually got analyzed.
      const numTweets = getNumTweetsFromTones(tones)
      // Now we find where to split the tweet data, depending on how many --------s we found in the output
      const splitTweets = requestBody.split(linebreak) // array containing tweets delimited by -------
      const slicedTweets = splitTweets.slice(numTweets)
      // Remaining tweets in sliced_tweets
      if (slicedTweets.length <= 1) {
        remainingTweets = false
      };
      if (numTweets === 0) { // we didn't analyze any tweets. Whoops!
        remainingTweets = false
      }
      requestBody = slicedTweets.join(linebreak)
      console.log('ToneAnalyzer: slice length: ' + slicedTweets.length)
      console.log('ToneAnalyzer: tweets found: ' + numTweets)
    }
    // Normalize to a decimal between 0 and 1
    console.log('ToneAnalyzer: Before normalisation ')
    console.log(result)
    if (result.count > 0) { // but only if there's data to analyze. don't want any divide by 0 errors
      result.happy /= result.count
      result.sad /= result.count
      result.anger /= result.count
      result.fear /= result.count
    }
    console.log('ToneAnalyzer: Normalised ')
    console.log(result)
  } else {
    const tones = await getTone(requestBody, false)
    const extractedTones = extractTones(tones)
    // We're not using sentences. So, we just extract tones wholesale from this.
    result = extractedTones
  }
  return result
};

async function getTone (text, useSentences = false) {
  while (true) {
    try {
      const toneParams = {
        toneInput: { text: text },
        contentType: 'application/json',
        sentences: useSentences
      }
      const result = await toneAnalyzer.tone(toneParams)
      return result
    } catch (err) {
      if (err.code !== 403) {
        // Failed for unknown reason
        return undefined
      } else {
        tryNextToneAnalyzer()
        if (toneAnalyzer === undefined) {
          return undefined
        }
      }
    }
  }
}

function tryNextToneAnalyzer () {
  toneAnalyzerIndex += 1
  if (toneAnalyzerIndex + 1 > apikeys.length) {
    toneAnalyzer = undefined
  } else {
    toneAnalyzer = new ToneAnalyzerV3({
      version: '2017-09-21',
      authenticator: new IamAuthenticator({
        apikey: apikeys[toneAnalyzerIndex]
      }),
      serviceUrl: urls[toneAnalyzerIndex]
    })
  }
}
function initialiseToneAnalyzer () {
  toneAnalyzerIndex = 0
  toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
      apikey: apikeys[toneAnalyzerIndex]
    }),
    serviceUrl: urls[toneAnalyzerIndex]
  })
}

function extractTones (toneData, useSentences = false) {
  // Extracts the raw tones from some tone data.
  if (useSentences) {
    let tonesCounter = 0
    let happyCounter = 0 // "joy"
    let sadCounter = 0 // "sadness"
    let angryCounter = 0 // "anger"
    let fearCounter = 0 // "fear"
    const sentencelist = toneData.sentences_tone
    for (const s in sentencelist) {
      const sentence = sentencelist[s]
      if (sentence.tones.length > 0) {
        tonesCounter += 1
        for (const t in sentence.tones) {
          const tone = sentence.tones[t]
          if (tone.tone_id === 'joy') {
            happyCounter += tone.score
          };
          if (tone.tone_id === 'sadness') {
            sadCounter += tone.score
          };
          if (tone.tone_id === 'anger') {
            angryCounter += tone.score
          };
          if (tone.tone_id === 'fear') {
            fearCounter += tone.score
          }
        }
      }
    }
    const outputTones = {
      count: tonesCounter,
      happy: happyCounter,
      sad: sadCounter,
      anger: angryCounter,
      fear: fearCounter
    }
    return outputTones
  } else {
    let happyCounter = 0 // "joy"
    let sadCounter = 0 // "sadness"
    let angerCounter = 0 // "anger"
    let fearCounter = 0 // "fear"
    const documentTones = toneData.document_tone
    const toneList = documentTones.tones
    for (const t in toneList) {
      const tone = toneList[t]
      if (tone.tone_id === 'joy') {
        happyCounter += tone.score
      };
      if (tone.tone_id === 'sadness') {
        sadCounter += tone.score
      };
      if (tone.tone_id === 'anger') {
        angerCounter += tone.score
      };
      if (tone.tone_id === 'fear') {
        fearCounter += tone.score
      }
    }
    const outputTones = {
      happy: happyCounter,
      sad: sadCounter,
      anger: angerCounter,
      fear: fearCounter
    }
    return outputTones
  }
}

function getNumTweetsFromTones (toneData) {
  // Figures out how many tweets are present in some tone data.
  // Errs on the side of caution: may end up sending a fragment or two of one tweet twice
  let tweetCounter = 0
  const sentencelist = toneData.sentences_tone
  for (const s in sentencelist) {
    const sentence = sentencelist[s]
    const text = sentence.text
    if (text.includes(linebreak)) {
      tweetCounter += 1
    }
  }
  return tweetCounter
}

export { initialiseToneAnalyzer }

export default analyseTweets
