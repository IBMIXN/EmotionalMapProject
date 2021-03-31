import * as React from "react";
import {
  Box,
  Text,
  Heading,
  Badge,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import Attribution from "../attribution";



export const StatControls = (): JSX.Element => {
  return (
    <Box overflow="auto" p={1} pb={8} pt={8}>
      <Box boxShadow="xs" p={4} rounded="lg">
        <Text>
          <strong>View statistics for the four emotions.</strong>
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
      <Box>
        <Heading as="h4" size="md" textAlign="center" mt={8} mb={2}>
          How does it work?
        </Heading>
        <Text>
          Every day, at midnight, the Emotion Map takes thousands of Tweets and feeds them through IBM Watson Tone Analyzer to determine the emotions of the UK. <br /><br />Results are grouped by location so that differences in regions can be visualised on a map.
<br /><br />
        </Text>
        <Attribution />
      </Box>
    </Box>
  );
};

export default StatControls;
