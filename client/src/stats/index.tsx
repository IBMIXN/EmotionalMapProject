import { Box, Flex, GridItem, SimpleGrid, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import Leaderboard from "./leaderboard";
import Pie from "./pie";
import Trending from "./trending";
import Map from "../map";

export const Stats = (): JSX.Element => {
  const mobileMode = useBreakpointValue({ base: true, md: false }) ?? false;
  const bg = useColorModeValue("white", "gray.900");

  return (
    <SimpleGrid
      gap={4}
      p={4}
      columns={mobileMode ? 1 : 2}
      backgroundColor={bg}
    >
      <GridItem >

        <Flex
          height="400px"
          width="100%"
          shadow="xs"
          rounded="lg"
          direction="column"
          p={4}
        >

          <Map onClickEnabled={false} />

        </Flex>
      </GridItem>
      <GridItem >
        <Pie />
      </GridItem>
      <GridItem>
        <Trending />
      </GridItem>
      <GridItem >
        <Leaderboard />
      </GridItem>
      <GridItem colSpan={mobileMode ? 1 : 2}>
        <Box m={4} mr={mobileMode ? 16 : 32} ml={mobileMode ? 16 : 32}>
          <Text textAlign="center" fontSize="sm">
            That&apos;s all!
          </Text>
          <Text textAlign="center" fontSize="xs" mt={2}>
            The data presented by this application should not be used to make any decisions and further research should be performed to determine conclusions from displayed information.
          </Text>
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};

export default Stats;
