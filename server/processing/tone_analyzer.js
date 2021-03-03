//Needed for Tone Analyzer API
import ToneAnalyzerV3 from 'ibm-watson/tone-analyzer/v3.js'
import { IamAuthenticator } from 'ibm-watson/auth/index.js'

const apikey = process.env.TONE_ANALYZER_KEY;
const url = process.env.TONE_ANALYZER_URL

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: apikey,
    }),
    serviceUrl: url,
});

const link_pattern = /https?:\/\/[\S]*/ //Catches links; while these are almost always t.co links we need to be careful
const hashtag_pattern = /[@#][\S]*/ //Catches #hashtags and @Mentions
const linebreak = "---------------------------------------------------------" //Used to delimit tweets

console.log("Tone analyser set up")

async function analyseTweets(tweets, useSentences = false) {
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
        "count": 0,
        "happy": 0,
        "sad": 0,
        "anger": 0,
        "fear": 0
    };

    let requestBody = "";

    for (let tweet of tweets) {
        let tweet_text = tweet.replace("\n"," ") //Makes analyzing easier later, and doesn't affect the tone
        while(tweet_text.includes("\n")){
            tweet_text = tweet_text.replace("\n"," ")
        }
        while(tweet_text.search(link_pattern) != -1){
            tweet_text = tweet_text.replace(link_pattern,"")
        }
        while(tweet_text.search(hashtag_pattern) != -1){
            tweet_text = tweet_text.replace(hashtag_pattern,"")
        }
        while(tweet_text.search(linebreak) != -1){ //If a tweet for some reason has -------------... etc in it...
            tweet_text = tweet_text.replace(linebreak,"")
            //This doesn't actually affect the tones - the analyzer picks up "------------" as its own sentence and assigns it zero tones.
        }
        if (useSentences) {
            if (/\S/.test(tweet_text)) { //There's at least 1 non-whitespace character, so analyze it
                requestBody += tweet_text
                requestBody += "\n " + linebreak + "\n";
            };
        } else {
            requestBody += tweet_text;
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
    //Now we've added all the tweets to the list in the correct format	
    if (useSentences) {
        let remainingTweets = true
        console.log(`ToneAnalyzer: request body length: ${requestBody.length}`)
        if (requestBody.length <= 0) { //If there's no text to add, don't analyze it
            remainingTweets = false;
        };
        while (remainingTweets) {
            //We now have a large string which contains the tweets. So, we send ALL of that data off to the analyzer.
            const tones = await getTone(requestBody, true)
            //Then, we use the data we get and update the emotional rankings.
            const extracted_tones = extractTones(tones, true)
            result["count"] += extracted_tones["count"]
            result["happy"] += extracted_tones["happy"]
            result["sad"] += extracted_tones["sad"]
            result["anger"] += extracted_tones["anger"]
            result["fear"] += extracted_tones["fear"]

            //We most likely won't get it all back, so we find out how many tweets actually got analyzed.
            const num_tweets = getNumTweetsFromTones(tones);
            //Now we find where to split the tweet data, depending on how many --------s we found in the output
            const split_tweets = requestBody.split(linebreak) //array containing tweets delimited by -------
            const sliced_tweets = split_tweets.slice(num_tweets)
            // Remaining tweets in sliced_tweets
            if (sliced_tweets.length <= 1) {
                remainingTweets = false
            };
            if (num_tweets == 0) { //we didn't analyze any tweets. Whoops!
                remainingTweets = false
            }
            requestBody = sliced_tweets.join(linebreak)
            console.log("slice length: " + sliced_tweets.length)
            console.log("tweets found: " + num_tweets)

        }
        //Normalize to a decimal between 0 and 1
        console.log(result)
        if (result["count"] > 0) { //but only if there's data to analyze. don't want any divide by 0 errors
            result["happy"] /= result["count"]
            result["sad"] /= result["count"]
            result["anger"] /= result["count"]
            result["fear"] /= result["count"]
        }
        console.log("Normalised: ")
        console.log(result)

    } else {
        const tones = await getTone(requestBody, false)
        const extracted_tones = extractTones(tones)
        //We're not using sentences. So, we just extract tones wholesale from this.
        result = extracted_tones
    }
    return result;
};

async function getTone(text, useSentences = false) {
    //Returns the raw tones present in some text.
    const toneParams = {
        toneInput: { 'text': text },
        contentType: 'application/json',
        sentences: useSentences
    };

    let result = await toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            return toneAnalysis.result
        })
        .catch(err => {
            console.log('error:', err);
        });
    return result
};

function extractTones(tone_data, useSentences = false) {
    //Extracts the raw tones from some tone data.
    if (useSentences) {
        let tones_counter = 0
        let happy_counter = 0 //"joy"
        let sad_counter = 0 //"sadness"
        let angry_counter = 0 //"anger"
        let fear_counter = 0 //"fear"
        var sentencelist = tone_data["sentences_tone"];
        for (let s in sentencelist) {
            let sentence = sentencelist[s]
            if (sentence["tones"].length > 0) {
                tones_counter += 1;
                for (let t in sentence["tones"]) {
                    let tone = sentence["tones"][t]
                    if (tone["tone_id"] == "joy") {
                        happy_counter += tone["score"]
                    };
                    if (tone["tone_id"] == "sadness") {
                        sad_counter += tone["score"]
                    };
                    if (tone["tone_id"] == "anger") {
                        angry_counter += tone["score"]
                    };
                    if (tone["tone_id"] == "fear") {
                        fear_counter += tone["score"]
                    }
                }
            }
        }
        let output_tones = {
            "count": tones_counter,
            "happy": happy_counter,
            "sad": sad_counter,
            "anger": angry_counter,
            "fear": fear_counter
        }
        console.log(output_tones)
        return output_tones
    } else {
        let happy_counter = 0 //"joy"
        let sad_counter = 0 //"sadness"
        let angry_counter = 0 //"anger"
        let fear_counter = 0 //"fear"
        var documentTones = tone_data["document_tone"];
        var tone_list = documentTones["tones"]
        for (let t in tone_list) {
            let tone = tone_list[t]
            if (tone["tone_id"] == "joy") {
                happy_counter += tone["score"]
            };
            if (tone["tone_id"] == "sadness") {
                sad_counter += tone["score"]
            };
            if (tone["tone_id"] == "anger") {
                angry_counter += tone["score"]
            };
            if (tone["tone_id"] == "fear") {
                fear_counter += tone["score"]
            }
        }
        let output_tones = {
            "happy": happy_counter,
            "sad": sad_counter,
            "anger": angry_counter,
            "fear": fear_counter
        }
        return output_tones
    }
}

function getNumTweetsFromTones(tone_data) {
    //Figures out how many tweets are present in some tone data.
    //Errs on the side of caution: may end up sending a fragment or two of one tweet twice
    let tweet_counter = 0
    var sentencelist = tone_data["sentences_tone"];
    for (let s in sentencelist) {
        let sentence = sentencelist[s]
        let text = sentence["text"]
        if (text.includes(linebreak)) {
            tweet_counter += 1;
        }
    }
    return tweet_counter
}

export default analyseTweets;