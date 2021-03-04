import {  Flex,  GridItem, SimpleGrid } from "@chakra-ui/react";
import * as React from "react";
import Leaderboard from "./leaderboard";
import Pie from "./pie";
import Trending from "./trending";
import Map from "../map";

export const Stats = (): JSX.Element => {
  return (
    <SimpleGrid
      gap={4}
      pb={4}
      columns={[1, null, 2]}
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
