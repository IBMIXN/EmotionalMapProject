import getTweets from "./tweets.js";
import fs from "fs"; // used to write JSON files for Tweets and hashtags.
import analyseTweets from "./tone_analyzer.js";

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
        let analyzedSettlements = [];
        for (let settlement of settlements) {
            const { tweets, hashtags } = await getTweets(settlement);
            console.log(tweets.length + " vs " + settlement.sample_size);
            const result = await analyseTweets(tweets, true);
            analyzedSettlements.push({
                name: settlement.name,
                joy: result.happy,
                sadness: result.sad,
                anger: result.anger,
                fear: result.fear
            })
        }
        const numberOfSettlements = settlements.length

        await models.County.create({
            name: county,
            joy: analyzedSettlements.reduce((acc, val) => acc + val.joy, 0) / numberOfSettlements,
            sadness: analyzedSettlements.reduce((acc, val) => acc + val.sadness, 0) / numberOfSettlements,
            anger: analyzedSettlements.reduce((acc, val) => acc + val.anger, 0) / numberOfSettlements,
            fear: analyzedSettlements.reduce((acc, val) => acc + val.fear, 0) / numberOfSettlements,
            settlements: analyzedSettlements
        })
    }
}

export { refresh };