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
    await Hashtag.deleteMany({});

    for (const [county, settlements] of Object.entries(counties)) {
        const settlementIds = [];
        const hashtagarray = []
        const emotionarray = []
        for (let settlement of settlements) {
            const { tweets, hashtags } = await getTweets(settlement);
            hashtagarray.push(hashtags);
            console.log(tweets.length + " vs " + settlement.sample_size);
            const result = await analyseTweets(tweets, true);
            const emotions = {
                joy: result.happy,
                sadness: result.sad,
                anger: result.anger,
                fear: result.fear
            };
            emotionarray.push(emotions);

            const addedSettlement = await Settlement.create({
                name: settlement.name,
                emotions: emotions
            });

            settlementIds.push(addedSettlement._id)
        }
        const hashtags = mergeSum(hashtagarray)
        const totals = mergeSum(emotionarray)
        const numberOfSettlements = settlements.length

        await County.create({
            name: county,
            emotions: {
                joy: totals.joy / numberOfSettlements,
                sadness: totals.sadness / numberOfSettlements,
                anger: totals.anger / numberOfSettlements,
                fear: totals.fear / numberOfSettlements
            },
            settlements: settlementIds
        });

        for (let hashtag in hashtags) {
            await Hashtag.findOneAndUpdate({ hashtag: hashtag }, {$inc: { count: hashtags[hashtag]} },  {new: true, upsert: true});
        }
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