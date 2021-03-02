import * as React from "react";
import {
  Box,
  Stack,
  Text,
  Heading,
  Badge,
} from "@chakra-ui/react";



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
          Every day, at midnight, we trawl through hundreds of tweets and pass
          them to IBM Watson for tone analysis.{" "}
        </Text>
      </Box>
    </Box>
  );
};

export default StatControls;
