import {
  Box,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import { getHashtagData, Hashtag } from "../../services/api";


export const Trending = (): JSX.Element => {

  const [hashtags, setHashtags] = React.useState<Hashtag[] | undefined>(undefined);
  React.useEffect(() => {
    getHashtagData().then((data) => {
      setHashtags(data)
    })
  }, [setHashtags])


  let table = () => {
    if (hashtags) {
      return <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Hashtag</Th>
            <Th isNumeric>Uses</Th>
          </Tr>
        </Thead><Tbody>{hashtags.map((hashtag, index) => {
          return <Tr key={index}>
            <Td width="10%">{index + 1}</Td>
            <Td>#{hashtag.hashtag}</Td>
            <Td isNumeric>{hashtag.count}</Td>
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
      <Heading size="lg" textAlign="center">Trending Hashtags</Heading>
      <Box mt={4}>
        {table()}
      </Box>
    </Box>
  );
};

export default Trending;
