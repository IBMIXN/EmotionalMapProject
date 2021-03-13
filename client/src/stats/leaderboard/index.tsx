import {
  Box,
  Heading,
  SkeletonText,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import { getJoyfulSettlements, Settlement } from "../../services/api";

export const Leaderboard = (): JSX.Element => {

  const [joyfulSettlements, setJoyfulSettlements] = React.useState<Settlement[] | undefined>(undefined);
  React.useEffect(() => {
    getJoyfulSettlements().then((data) => {
      setJoyfulSettlements(data)
    })
  }, [setJoyfulSettlements])


  const table = () => {
    if (joyfulSettlements) {
      return <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Settlement</Th>
            <Th>Joy Level</Th>
          </Tr>
        </Thead><Tbody>{joyfulSettlements.map((settlement, index) => {
          return <Tr key={index}>
            <Td width="10%">{index + 1}</Td>
            <Td>{settlement.name}</Td>
            <Td>{(settlement.emotions.joy * 100).toFixed(0)}%</Td>
          </Tr>
        })}
        </Tbody>
      </Table>

    } else {
      return <SkeletonText mt="8" noOfLines={10} spacing="4" skeletonHeight="8" />
    }
  }

  return (
    <Box height="100%" width="100%" shadow="xs" rounded="lg" p={4}>
      <Heading size="lg" textAlign="center">Happiest Settlements</Heading>
      <Box mt={4}>
        {table()}
      </Box>
    </Box>
  );
};

export default Leaderboard;
