import { Text } from "@chakra-ui/layout";
import React from "react"




export const Attribution = (): JSX.Element => {
    return (
        <React.Fragment>
            <Text fontSize="xs">Map data is provided by <a href="https://www.ordnancesurvey.co.uk/business-government/products/boundaryline"><Text as="u">ordnancesurvey.co.uk</Text></a> and <a href="https://www.opendatani.gov.uk/dataset/osni-open-data-50k-boundaries-ni-counties"><Text as="u">opendatani.gov.uk</Text></a>  under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"><Text as="u">Open Government Licence v3.0</Text></a></Text>
            <a href="https://developer.twitter.com/"> <Text mt={2} fontSize="xs" as="u">Twitter API</Text></a>
            <a href="https://www.ibm.com/watson/services/tone-analyzer/"> <Text mt={2} fontSize="xs" as="u">IBM Watson Tone Analyzer</Text></a>
            <br />
            <a href="https://github.com/IBMIXN/EmotionalMapProject"> <Text mt={2} fontSize="xs">Code available on GitHub</Text></a>
            <br/>
            <Text mt={2} fontSize="xs">This application is a proof of concept to showcase IBM Watson Tone Analyzer: the data presented should not be used to make any decisions and further research should be performed to determine conclusions from displayed information.</Text>
        </React.Fragment>
    );
};

export default Attribution;