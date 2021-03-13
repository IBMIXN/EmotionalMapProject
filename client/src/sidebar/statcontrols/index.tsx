import * as React from "react";
import {
  Box,
  Stack,
  Text,
  Heading,
  Badge,
} from "@chakra-ui/react";
import Attribution from "../attribution";



export const StatControls = (): JSX.Element => {
  return (
    <Box overflow="auto" p={1} pb={8} pt={8}>
      <Box boxShadow="xs" p={4} rounded="lg">
        <Text>
          <strong>View data for these four emotions</strong>
          <br />
        </Text>
        <Stack mt={4} direction="row">
          <Badge colorScheme="green">Joy</Badge>
          <Badge colorScheme="orange">Fear</Badge>
          <Badge colorScheme="red">Anger</Badge>
          <Badge colorScheme="blue">Sadness</Badge>
        </Stack>
      </Box>
      <Box>
        <Heading as="h4" size="md" textAlign="center" mt={8} mb={2}>
          How does it work?
        </Heading>
        <Text>
          The Emotion Map has been developed to provide an example of how IBM Watson can be used to demonstrate the benefits and capabilities of Artificial Intelligence.
          <br /><br />
          Every day, at midnight, we trawl through hundreds of Tweets and use IBM Watson to analyse them.
          <br /><br />
        </Text>
        <Attribution />
      </Box>
    </Box>
  );
};

export default StatControls;
