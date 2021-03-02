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
import joy from "./joy.json";

export const Leaderboard = (): JSX.Element => {

  return (
    <Box height="100%" width="100%" shadow="xs" rounded="lg" p={4}>
      <Heading size="lg"  textAlign="center">Happiest Counties</Heading>
      <Box mt={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Position</Th>
              <Th>County</Th>
            </Tr>
          </Thead>
          <Tbody>
            {joy.map((data, index) => {
              return <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{data.location}</Td>
            </Tr>
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Leaderboard;
