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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { View, setView, setEmotion, Emotion } from "../../slices/selectedMap";
import Attribution from "../attribution";

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
                <strong>Choose an emotion for the map.</strong>
                <br /> The darker the colour, the stronger that emotion.
              </Text>
              <RadioGroup value={emotion} onChange={(value) => dispatch(setEmotion(value as Emotion))}>
                <Stack>
                  <Radio size="lg" value={Emotion.JOY} colorScheme="green">
                    <Badge colorScheme={emotion === Emotion.JOY ? "green" : "default"}>Happy</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.FEAR} colorScheme="orange">
                    <Badge colorScheme={emotion === Emotion.FEAR ? "orange" : "default"}>Concerned</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.ANGER} colorScheme="red">
                    <Badge colorScheme={emotion === Emotion.ANGER ? "red" : "default"}>Impassioned</Badge>
                  </Radio>
                  <Radio size="lg" value={Emotion.SADNESS} colorScheme="blue">
                    <Badge colorScheme={emotion === Emotion.SADNESS ? "blue" : "default"}>Pensive</Badge>
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
              <Wrap mt={4} >
                <WrapItem >
                  <Badge colorScheme="green">Happy</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="orange">Concerned</Badge>
                </WrapItem>
                <WrapItem>

                  <Badge colorScheme="red">Impassioned</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="blue">Pensive</Badge>
                </WrapItem>
              </Wrap>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box>
        <Heading as="h4" size="md" textAlign="center" mt={8} mb={2}>
          How does it work?
        </Heading>
        <Text>
          Every day, at midnight, the Emotion Map takes thousands of Tweets and feeds them through IBM Watson Tone Analyzer to determine the emotions of the UK. <br /><br /> Results are grouped by location so that differences in regions can be visualised on a map.
          <br /><br />
        </Text>
        <Attribution />
      </Box>
    </Box>
  );
};

export default MapControls;
