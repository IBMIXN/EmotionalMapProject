import {  Flex,  GridItem, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import Leaderboard from "./leaderboard";
import Pie from "./pie";
import Trending from "./trending";
import Map from "../map";

export const Stats = (): JSX.Element => {
  const bg = useColorModeValue("white", "gray.900");

  return (
    <SimpleGrid
      gap={4}
      p={4}
      columns={[1, null, 2]}
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
    </SimpleGrid>
  );
};

export default Stats;
