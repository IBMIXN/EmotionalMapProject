const fs = require('fs')
const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
const geojson = require("./input/geojson.json")

// Load in all counties in britian
const northernireland = require("./data/northernirelandgeojson.json")
const allcounties = require("./data/britishcountiesgeojson.json");
allcounties.features.push(...northernireland.features)

let result = {}

// Lookup for counties
let lookup = new GeoJsonGeometriesLookup(allcounties)

// Filter only points in case anything else is left in geojson
const points = geojson.features.filter(feature => {
    return feature.geometry.type === "Point"
})

for (let point of points) {
    const radius = point.properties.radius
    const name = point.properties.name
    const sampleSize = point.properties.sample_size
    if (radius && name && sampleSize) {
        const county = lookup.getContainers(point.geometry, { ignorePoints: true }).features[0]
        // Northern Ireland county property keys are different.
        const county_name = county.properties["NAME"] || county.properties["CountyName"]
        const coordinates = point.geometry.coordinates
        const settlement = {
            name,
            geocode: `${coordinates[1]},${coordinates[0]},${radius}`,
            sample_size: sampleSize,
        }
        if (result[county_name] != undefined) {
            result[county_name].push(settlement)
        } else {
            result[county_name] = [settlement]
        }
    } else {
        console.error(`Could not process feature ${JSON.stringify(point)}`)
    }
}

// In case some of the data is provided in this format already and needs normalising
const json = require("./input/json.json");
result = {...result, ...json}

let countyTotals = {}
let counties = {}

for (const [county, settlements] of Object.entries(result)) {

    for (let settlement of settlements) {
        const sampleSize = settlement.sample_size
        if (countyTotals[county] != undefined) {
            countyTotals[county] += sampleSize
        } else {
            countyTotals[county] = sampleSize
        }
        if (counties[county] != undefined) {
            counties[county].push(settlement.name)
        } else {
            counties[county] = [settlement.name]
        }
    }
  
}

// Scale tweets down
const tweetTotalPerCounty = 200
for (const [county, settlements] of Object.entries(result)) {
    for (let settlement of settlements) {
        settlement.sample_size = Math.floor((settlement.sample_size / countyTotals[county]) * tweetTotalPerCounty)
    }
}

fs.writeFileSync("output/counties.json", JSON.stringify(result))
fs.writeFileSync("output/counties_list.json", JSON.stringify(counties))
