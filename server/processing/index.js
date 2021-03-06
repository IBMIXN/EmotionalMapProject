import getTweets from "./tweets.js";
import fs from "fs"; // used to write JSON files for Tweets and hashtags.
import analyseTweets from "./tone_analyzer.js";
import Settlement from "../models/settlement.js";
import County from "../models/county.js";
import Hashtag from "../models/hashtag.js";

async function refresh() {
    // Get tweets
    const counties = await fs.promises.readFile("./data/counties.json").then((data, err) => {
        if (err) {
            console.error("Could not find counties file");
            return;
        }
        return JSON.parse(data);
    });

    await County.deleteMany({});
    await Settlement.deleteMany({});
    await Hashtag.deleteMany({});

    for (const [county, settlements] of Object.entries(counties)) {
        const numberOfSettlements = settlements.length
        console.log(`Processing county ${county} with ${numberOfSettlements} settlements`);
        const settlementIds = [];
        const hashtagarray = []
        const emotionarray = []
        for (let settlement of settlements) {
            console.log(`Getting tweets for ${county} : ${settlement.name}`);
            const { tweets, hashtags } = await getTweets(settlement);
            hashtagarray.push(hashtags);
            console.log(`Received ${tweets.length} tweets (expected ${settlement.sample_size})`);
            console.log(`Analysing tweets for ${county} : ${settlement.name}`);
            const result = await analyseTweets(tweets, true);
            const emotions = {
                joy: result.happy,
                sadness: result.sad,
                anger: result.anger,
                fear: result.fear
            };
            console.log(`Received ${JSON.stringify(emotions)} for ${county} : ${settlement.name}`);
            emotionarray.push(emotions);

            const addedSettlement = await Settlement.create({
                name: settlement.name,
                emotions: emotions
            });

            settlementIds.push(addedSettlement._id)
        }
        const hashtags = mergeSum(hashtagarray)
        const totals = mergeSum(emotionarray)

        const countyEmotions = {
            joy: totals.joy / numberOfSettlements,
            sadness: totals.sadness / numberOfSettlements,
            anger: totals.anger / numberOfSettlements,
            fear: totals.fear / numberOfSettlements
        };

        console.log(`Adding ${county} to database with ${JSON.stringify(countyEmotions)}`);

        await County.create({
            name: county,
            emotions: countyEmotions,
            settlements: settlementIds
        });

        console.log(`Incrementing tally for ${Object.keys(hashtags).length} hashtags`);
        for (let hashtag in hashtags) {
            await Hashtag.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: hashtags[hashtag] } }, { new: true, upsert: true });
        }
        console.log(`${county} done!`);
    }

}


function mergeSum(objectarray) {
    const result = {};
    for (let object of objectarray) {
        for (let [key, value] of Object.entries(object)) {
            if (result[key]) {
                result[key] += value;
            } else {
                result[key] = value;
            }
        }
    }
    return result;
};

export { refresh };