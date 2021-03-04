import fetch from "node-fetch"; // used to access the Twitter API


const reqHeaders = new fetch.Headers([['authorization', `Bearer ${process.env.TWITTER_API_BEARER_TOKEN}`]]);
const reqInit = {
    method: 'GET',
    headers: reqHeaders,
};


async function getTweets(settlement) {
    let hashtags = {};
    let name = settlement.name;
    let tweet_texts = []
    /* the text of Tweets are stored in multiple arrays
       that are keyed by the settlement name */
    let page_size = Math.min(settlement.sample_size, 100);
    /* this cannot change for repeated requests for the same settlement,
       so if more than 100 Tweets are needed, all requests will be for
       100 Tweets but not all Tweets from the response will be stored */
    let url = 'https://api.twitter.com/1.1/search/tweets.json';
    let query = `?result_type=recent&geocode=${settlement.geocode}&count=${page_size}&include_entities=true&tweet_mode=extended&lang=en`;
    // query is updated in the response of the first request
    let sample_remaining = settlement.sample_size;
    /* multiple requests need to be sent if more than 100 Tweets are
       required for a settlement */
    let attempts_remaining = 2; // two attempts per individual request
    while (sample_remaining > 0) {
        try {
            // send a new request to the Twitter API
            console.log(`Requesting ${page_size} tweets`);
            console.log(url+query)
            const results = await fetch(url + query, reqInit).then(data => data.json());
            // check that the response contains Tweets (before the query is changed)
            if (results['statuses'].length === 0) {
                throw new Error('The response contained 0 Tweets.');
            }

            /* extract the Tweets, hashtags and the query
            for the next page of results from results */


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
                tweet_texts.push(tweet_text);

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
            }

            sample_remaining -= page_size;
            if (sample_remaining <= 0) {
                break;
                /* if sample_size > 100, the last request will still be for
                100 Tweets, but we might not want to store all of them,
                so break as soon as the desired number is met */
            }
            /* change the number of Tweets to fetch if the last request needs
         fewer than 100 */
            page_size = Math.min(sample_remaining, 100);
            // override the provided count parameter by placing this earlier
            query = `?count=${page_size}&` +
                results['search_metadata']['next_results'].slice(1) +
                '&tweet_mode=extended';
            // the query it provides loses the tweet_mode parameter so reinstate it
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
    return {
        tweets: tweet_texts,
        hashtags: hashtags
    };
}

export default getTweets;