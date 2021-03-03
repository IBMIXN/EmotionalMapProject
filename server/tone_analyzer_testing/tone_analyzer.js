const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3'); //Needed for Tone Analyzer API
const { IamAuthenticator } = require('ibm-watson/auth'); //Needed for Tone Analyzer API

const fs = require('fs'); //Needed for loading files

const tweet_data = require("./tweets.json"); //remove this and replace it with the actual tweet data

const credentials = require('./tone-analyzer-credentials.json'); //Credentials

const apikey = process.env.TONE_ANALYZER_KEY;

console.log(apikey)
console.log("api read")

const url = process.env.TONE_ANALYZER_URL

console.log(url)
console.log("url set up")

toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: apikey,
  }),
  serviceUrl: url,
});

console.log("analyzer set up")

async function getTone(text,useSentences = false){
	//Returns the raw tones present in some text.
	const toneParams = {
	  toneInput: { 'text': text },
	  contentType: 'application/json',
	  sentences: useSentences
	};
	
	var result;
	var t = await toneAnalyzer.tone(toneParams)
	  .then(toneAnalysis => {
		//console.log(JSON.stringify(toneAnalysis.result, null, 2));
		result = JSON.stringify(toneAnalysis.result,null,2)
	  })
	  .catch(err => {
		console.log('error:', err);
	  });
	return result
};

function extractTones(tone_data,useSentences = false){
	//Extracts the raw tones from some tone data.
	if(useSentences){
		towns_counter = 0
		happy_counter = 0 //"joy"
		sad_counter   = 0 //"sadness"
		angry_counter = 0 //"anger"
		fear_counter  = 0 //"fear"
		var parsed = JSON.parse(tone_data)
		var sentencelist = parsed["sentences_tone"];
		for(s in sentencelist){
			sentence = sentencelist[s]
			if(sentence["tones"].length > 0){
				towns_counter+=1;
				for(t in sentence["tones"]){
					tone = sentence["tones"][t]
					if(tone["tone_id"] == "joy"){
						happy_counter+=tone["score"]
					};
					if(tone["tone_id"] == "sadness"){
						sad_counter+=tone["score"]
					};
					if(tone["tone_id"] == "anger"){
						angry_counter+=tone["score"]
					};
					if(tone["tone_id"] == "fear"){
						fear_counter+=tone["score"]
					}
				}
			}
		}
		output_tones = {
			"count": towns_counter,
			"happy": happy_counter,
			"sad": sad_counter,
			"anger": angry_counter,
			"fear": fear_counter
		}
		console.log(output_tones)
		return output_tones
	}else{
		happy_counter = 0 //"joy"
		sad_counter   = 0 //"sadness"
		angry_counter = 0 //"anger"
		fear_counter  = 0 //"fear"
		console.log(tone_data)
		var parsed = JSON.parse(tone_data)
		var documentTones = parsed["document_tone"];
		var tone_list = documentTones["tones"]
		for(t in tone_list){
			tone = tone_list[t]
			if(tone["tone_id"] == "joy"){
				happy_counter+=tone["score"]
			};
			if(tone["tone_id"] == "sadness"){
				sad_counter+=tone["score"]
			};
			if(tone["tone_id"] == "anger"){
				angry_counter+=tone["score"]
			};
			if(tone["tone_id"] == "fear"){
				fear_counter+=tone["score"]
			}
		}
		output_tones = {
			"happy": happy_counter,
			"sad": sad_counter,
			"anger": angry_counter,
			"fear": fear_counter
		}
		console.log(output_tones)
		return output_tones
	}
}

function getNumTweetsFromTones(tone_data){
	//Figures out how many tweets are present in some tone data.
	//Errs on the side of caution: may end up sending a fragment or two of one tweet twice
	const linebreak = "---------------------------------------------------------"
	tweet_counter = 0
	var parsed = JSON.parse(tone_data)
	var sentencelist = parsed["sentences_tone"];
	for(s in sentencelist){
		sentence = sentencelist[s]
		text = sentence["text"]
		if(text.includes(linebreak)){
			tweet_counter+=1;
		}
	}
	return tweet_counter
}

async function processTweets(tweetData,useSentences = false){
	/*
	tweetData: A JSON file containing the tweet data, in the format:	
	{
		"Place 1": ["ANGRY TWEET!",
					"not so angry tweet"],
		"Place 2": ["more tweets",
					"etc"]		
	}
	
	useSentences: A boolean value which represents if you want to do sentence-level analysis (really costly for our quots!) or document-level analysis (use this one for testing).
	
	We want to process all the tweets as a whole for each place, so place 1 gets processed as a whole, then place 2, etc.
	The output will be in the form of:
	{
		"Place 1": [Happy: 0.725,
					Sad: 0.4,
					Angry: 0.549,
					Scared: 0.123],
		"Place 2": [Happy: 1.00,
					"etc"]		
	}
	regardless if useSentences is true or false. So what we do is loop through each place in the tweet data, then look at each of the tweets. We filter out any bad ones that are just mentions/hashtags, then lump them all together and process them.
	*/
	
	
	var out_json = {};
	/* Target output is something like:
	{
		"Durham":{
			"count": 100,
			"happy": 0.1,
			"sad": 0.5,
			"angry": 0.3,
			"fear": 0.1
		},
		"Seaham":{
			"count":10,
			"happy":0.9,
			"sad":0.1,
			"angry":0.2,
			"fear":0.999
		}		
	}
	etc */ 
	
	for(place in tweetData){
		var out_text = "";
		out_json[place] = {
			"count": 0,
			"happy": 0,
			"sad":   0,
			"anger": 0,
			"fear":  0
		};	
		console.log("place:")
		console.log(place)
		
		const link_pattern = /https?:\/\/[\S]*/ //Catches links; while these are almost always t.co links we need to be careful
		const hashtag_pattern = /[@#][\S]*/ //Catches #hashtags and @Mentions
		const linebreak = "---------------------------------------------------------" //Used to delimit tweets
		
		var counter = 0
		var tone_list = {
			"count": 0,
			"happy": 0,
			"sad":   0,
			"anger": 0,
			"fear":  0
		};
		
		for(tweet in tweetData[place]){
			raw_text = tweetData[place][tweet]
			raw_text = raw_text.replace("\n"," ") //Makes analyzing easier later, and doesn't affect the tone
			while(raw_text.includes("\n")){
				raw_text = raw_text.replace("\n"," ")
			}
			while(raw_text.search(link_pattern) != -1){
				raw_text = raw_text.replace(link_pattern,"")
			}
			while(raw_text.search(hashtag_pattern) != -1){
				raw_text = raw_text.replace(hashtag_pattern,"")
			}
			while(raw_text.search(linebreak) != -1){ //If a tweet for some reason has -------------... etc in it...
				raw_text = raw_text.replace(linebreak,"")
				//This doesn't actually affect the tones - the analyzer picks up "------------" as its own sentence and assigns it zero tones.
			}
			if(useSentences){
				if(/\S/.test(raw_text)){ //There's at least 1 non-whitespace character, so analyze it
					out_text+=raw_text
					out_text += "\n "+linebreak+"\n";
				};
			}else{
				out_text+=raw_text;
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
		if(useSentences){
			flag = true
			console.log(out_text.length)
			if(out_text.length <= 0){ //If there's no text to add, don't analyze it
				flag = false;
			};
			while(flag){
				//We now have a large string which contains the tweets. So, we send ALL of that data off to the analyzer.
				out_tones = await(getTone(out_text,true))
				console.log(out_tones)
				//Then, we use the data we get and update the emotional rankings.
				extracted_tones = extractTones(out_tones,true)
				out_json[place]["count"] += extracted_tones["count"]
				out_json[place]["happy"] += extracted_tones["happy"]
				out_json[place]["sad"] += extracted_tones["sad"]
				out_json[place]["anger"] += extracted_tones["anger"]
				out_json[place]["fear"] += extracted_tones["fear"]
				
				//We most likely won't get it all back, so we find out how many tweets actually got analyzed.
				num_tweets = getNumTweetsFromTones(out_tones); 
				//Now we find where to split the tweet data, depending on how many --------s we found in the output
				split_tweets = out_text.split(linebreak) //array containing tweets delimited by -------
				sliced_tweets = split_tweets.slice(num_tweets)
				if(sliced_tweets.length <= 1){
					flag = false
				};
				if(num_tweets == 0){ //we didn't analyze any tweets. Whoops!
					flag = false
				}
				out_text = sliced_tweets.join(linebreak)
				console.log("slice length: "+sliced_tweets.length)
				console.log("tweets found: "+num_tweets)
				
			}
			//Normalize to a decimal between 0 and 1
			console.log(out_json[place])
			count = out_json[place]["count"]
			if(count > 0){ //but only if there's data to analyze. don't want any divide by 0 errors
				out_json[place]["happy"] = out_json[place]["happy"] / out_json[place]["count"]
				out_json[place]["sad"] = out_json[place]["sad"] / out_json[place]["count"]
				out_json[place]["anger"] = out_json[place]["anger"] / out_json[place]["count"]
				out_json[place]["fear"] = out_json[place]["fear"] / out_json[place]["count"]
			}
			console.log("")
			console.log(out_json[place])

		}else{
			out_tones = await(getTone(out_text,false))
			tone_list = extractTones(out_tones)
			//We're not using sentences. So, we just extract tones wholesale from this.
			out_json[place] = tone_list
			console.log(out_json[place])
		}
	};
	return out_json;
};

(async ()=>{console.log("processing...");
	//tone_data = await processTweets(tweet_data,true);
	
	
	
	console.log("done");
})()













