import getTweets from "./tweets.js";
import fs from "fs"; // used to write JSON files for Tweets and hashtags.
import analyseTweets from "./tone_analyzer.js";
import Settlement from "../models/settlement.js";
import County from "../models/county.js";

async function refresh(models) {
    // Get tweets
    const counties = await fs.promises.readFile("./data/counties.json").then((data, err) => {
        if (err) {
            console.error("Could not find counties file");
            return;
        }
        return JSON.parse(data);
    });

    await models.County.deleteMany({});

    for (const [county, settlements] of Object.entries(counties)) {
        const settlementIds = [];
        const totals = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0
        }
        for (let settlement of settlements) {
            const { tweets, hashtags } = await getTweets(settlement);
            console.log(tweets.length + " vs " + settlement.sample_size);
            const result = await analyseTweets(tweets, true);

            totals.joy += result.happy;
            totals.sadness += result.sad;
            totals.anger += result.anger;
            totals.fear += result.fear;

            const addedSettlement = await Settlement.create({
                name: settlement.name,
                emotions: {
                    joy: result.happy,
                    sadness: result.sad,
                    anger: result.anger,
                    fear: result.fear
                }
            });

            settlementIds.push(addedSettlement._id)
        }
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
    }
}

export { refresh };