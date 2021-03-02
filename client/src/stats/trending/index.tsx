import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import hashtags from "./hashtags.json";


export const Trending = (): JSX.Element => {

  return (
    <Box height="100%" width="100%" shadow="xs" rounded="lg" p={4}>
      <Heading size="lg"  textAlign="center">Trending Hashtags</Heading>
      <Box mt={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Hashtag</Th>
              <Th isNumeric>Uses</Th>
            </Tr>
          </Thead>
          <Tbody>
            {hashtags.map((trending_hashtags, index) => {
              return <Tr key={index}>
              <Td width="10%">{index + 1}</Td>
              <Td>{trending_hashtags.hashtag}</Td>
              <Td isNumeric>{trending_hashtags.uses}</Td>
            </Tr>
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Trending;
