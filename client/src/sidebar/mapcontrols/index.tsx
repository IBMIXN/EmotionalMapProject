import * as React from "react";
import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
  Heading,
  Badge,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { View, setView, setEmotion, Emotion } from "../../slices/selectedMap";

const tabIndexes = [View.SINGLE, View.STRONGEST];

export const MapControls = (): JSX.Element => {
  const dispatch = useDispatch();
  const { view, emotion } = useSelector(
    (state: RootState) => state.selectedMap
  );
  return (
    <Box overflow="auto" p={1} pb={8} pt={8}>
      <Tabs
        isFitted
        variant="soft-rounded"
        colorScheme="brand"
        onChange={(index) => dispatch(setView(tabIndexes[index]))}
        index={view}
      >
        <TabList>
          <Tab>Choose Emotion</Tab>
          <Tab>Strongest Emotion</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} mt={6}>
            <Box boxShadow="xs" p={4} rounded="lg">
              <Text mb={4}>
                <strong>Choose an emotion.</strong>
                <br /> The darker the colour, the stronger that emotion.
              </Text>
              <RadioGroup value={emotion} onChange={(value) => dispatch(setEmotion(value as Emotion))}>
                <Stack>
                  <Radio size="lg" value={Emotion.JOY} colorScheme="green">
                    <Badge colorScheme={emotion === Emotion.JOY ? "green" : "default"}>Joy</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.FEAR} colorScheme="orange">
                    <Badge colorScheme={emotion === Emotion.FEAR ? "orange" : "default"}>Fear</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.ANGER} colorScheme="red">
                    <Badge colorScheme={emotion === Emotion.ANGER ? "red" : "default"}>Anger</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.SADNESS} colorScheme="blue">
                    <Badge colorScheme={emotion === Emotion.SADNESS ? "blue" : "default"}>Sadness</Badge>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </TabPanel>
          <TabPanel p={0} mt={6}>
            <Box boxShadow="xs" p={4} rounded="lg">
              <Text>
                <strong>View the strongest emotions.</strong>
                <br />
                The strongest emotion for each region is shown on the map.
                <br />
              </Text>
              <Stack mt={4} direction="row">
                <Badge colorScheme="green">Joy</Badge>
                <Badge colorScheme="orange">Fear</Badge>
                <Badge colorScheme="red">Anger</Badge>
                <Badge colorScheme="blue">Sadness</Badge>
              </Stack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box>
        <Heading as="h4" size="md" textAlign="center" mt={8} mb={2}>
          How does it work?
        </Heading>
        <Text>
          The Emotion Map has been developed to provide an example of how our IBM Watson
           can be used to demonstrate the benefits and capabilities of Artificial Intelligence (AI).<br /><br/>
           Every day, at midnight, we trawl through hundreds of tweets and pass
          them to IBM Watson for tone analysis.
          <br /><br/>
        </Text>
        <Text fontSize="xs">Map data is provided by <a href="https://www.ordnancesurvey.co.uk/business-government/products/boundaryline"><Text as="u">ordnancesurvey.co.uk</Text></a> and <a href="https://www.opendatani.gov.uk/dataset/osni-open-data-50k-boundaries-ni-counties"><Text as="u">opendatani.gov.uk</Text></a>  under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"><Text as="u">Open Government Licence v3.0</Text></a></Text>
       <a href="https://developer.twitter.com/"> <Text mt={2} fontSize="xs" as="u">Twitter API</Text></a>
       <a href="https://www.ibm.com/watson/services/tone-analyzer/"> <Text mt={2} fontSize="xs" as="u">IBM Watson Tone Analyzer</Text></a>

      </Box>
    </Box>
  );
};

export default MapControls;
