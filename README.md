# Emotional Map Project

The Emotion Map has been developed by students to provide an example of how IBM Watson can be used to demonstrate the benefits and capabilities of Artificial Intelligence.

By combining multiple IBM technologies with geospatial data, we have been able to produce a (near) real-time map of the UK that visualises the proportion of four key emotions (joy, fear, anger and sadness) in the countries' Tweets. Twitter was chosen as our data source, since it provides a comprehensive API. Other social media networks, including Facebook, do not provide enough individual geospatial data for meaningful analysis. 

IBM Watson's Tone Analyser is used to process the emotional and language tones and the data is then visualised at settlement granularity.

**It must be noted that the data presented by this application should not be used to make any decisions and further research is recommended to determine conclusions from our information.**

Map data is provided by [ordnancesurvey.co.uk](https://www.ordnancesurvey.co.uk/business-government/products/boundaryline) and [opendatani.gov.uk](https://www.opendatani.gov.uk/dataset/osni-open-data-50k-boundaries-ni-counties) under the [Open Government Licence v3.0](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) [Twitter API](https://developer.twitter.com/) [IBM Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/)
## Demonstration
The web application can be found at [emotionmap.uk](https://www.emotionmap.uk).

## Deployment

We have set up docker containers for this project.

Run a dev build (with hot reload):
```
docker-compose up
docker-compose down
```

Run a production build (in detached mode):
* First clone the project to your production machine.
* Then run the following commands within the repository directory:
```
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose logs -f
docker-compose -f docker-compose.prod.yml down
```

Whilst learning how to use Docker with docker-compose, the repository [mrcoles/node-react-docker-compose](https://github.com/mrcoles/node-react-docker-compose) was found to be a very useful learning tool. In order to further simplify the deployment, Caddy is used to proxy and serve the API over SSL encryption.

## Further Information

UserManual.pdf provides more in-depth information on the system:
* Comprehensive feature overview
* Complete deployment walkthrough
* System maintenance
* Guidance for further development
