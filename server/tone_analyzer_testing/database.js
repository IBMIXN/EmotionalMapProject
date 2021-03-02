const { CloudantV1 } = require('@ibm-cloud/cloudant'); //include the database
const { IamAuthenticator } = require('ibm-cloud-sdk-core'); //auth

const credentials = require('./cloudant-credentials.json'); //Credentials

const url = credentials["url"];
const username = credentials["username"];
const apikey = credentials["apikey"];

const authenticator = new IamAuthenticator({
    apikey: apikey
});

const service = new CloudantV1({
    authenticator: authenticator
});

const tweetdata = require("./tweet_output.json"); //testing

service.setServiceUrl(url);

console.log("url: "+url);
console.log("username: "+username);
console.log("apikey: "+apikey);

async function updateDatabase(tonedata,database){
	//Sends data to a database.
	//THIS WILL ERASE ANY PREVIOUS TONES IF IT SUCCEEDS!
	//Database should either be tone-analyzer for the tone analyzer, or hashtags for the hashtags.
	
	//First, see if there's already a document in the database.
	documents = service.postAllDocs({
		db: database,
		includeDocs: true
	}).then(response => {
		if(response.result.rows.length > 0){ //If there's more than 0, then just edit the first one.
			console.log("making a new row!")
			id = response.result.rows[0].id
			console.log(id)
			tweetdata._id = id;
			service.postDocument({
				db: database,
				document: tweetdata
			}).then(response => {
				console.log(response.result);
			}).catch(error => {
				console.log("Error status code: " + error.status);
				console.log("Error status text: " + error.statusText);
				console.log("Error message:     " + error.message);
				console.log("Error details:     " + error.body)
			});
		}else{ //Otherwise, just post another document with the data.
			console.log("making a new document!");
			service.postDocument({
				db: database,
				document: tweetdata
			}).then(response => {
				console.log(response.result);
			}).catch(error => {
				console.log("Error status code: " + error.status);
				console.log("Error status text: " + error.statusText);
				console.log("Error message:     " + error.message);
				console.log("Error details:     " + error.body)
			});
		}
	}).catch(error => {
		console.log("Error: Retrieving documents failed.")
		console.log(error.message)
	});
}

async function getDocuments(database){
	//Returns a list of all the tones from the database.
	//Returns null if there's none.
	service.postAllDocs({
		db: database,
		includeDocs: true
	}).then(response => {
		console.log(response.result);
		if(response.result.rows.length > 0){
			console.log(response.result.rows[0].doc);
			return response.result.rows[0].doc
		}else{
			return null
		};
	}).catch(error => {
		console.log("Error: Retrieving documents failed.");
		console.log(error);
	});
}
(async ()=>{console.log("processing...");
	await updateDatabase(tweetdata,"tone-analyzer");
	await getDocuments("tone-analyzer")
})()












