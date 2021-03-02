import { Box, Icon, Heading, useTheme, Table, Tbody, Td, Center, } from "@chakra-ui/react";
import * as React from "react";
import { PieChart } from "react-minimal-pie-chart";
import data from "./pie_data.json";

export const Pie = (): JSX.Element => {
  const theme = useTheme();
  const colours = [theme.colors.green[400], theme.colors.orange[400], theme.colors.red[400], theme.colors.blue[400]];

  return (
    <Box
      height="400px"
      width="100%"
      shadow="xs"
      rounded="lg"
      direction="column"
      p={4}
    >
      <Heading size="lg" textAlign="center">Overall Emotion</Heading>
      {/* <SimpleGrid columns={2}> */}

      <Box mt={6} alignContent="right">
        <PieChart
          style={{
            height: "250px",
            fontFamily:
              '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
            fontSize: "0.3em",
          }}
          label={({ dataEntry }) => `${dataEntry.value}%`}
          labelStyle={{
            fill: "#fff",
            opacity: 1,
            pointerEvents: "none",
          }}
          data={[
            { title: data[0].emotion, value: parseInt(data[0].value), color: colours[0] },
            { title: data[1].emotion, value: parseInt(data[1].value), color: colours[1] },
            { title: data[2].emotion, value: parseInt(data[2].value), color: colours[2] },
            { title: data[3].emotion, value: parseInt(data[3].value), color: colours[3] },
          ]}
        />      </Box>



      <Center><Table mt={3} width="80%" variant="unstyled">
        <Tbody>
          {data.map((emotion, index) => {
            return <React.Fragment>
              <Td width="10px" style={{ padding: 0 }}>
                <Icon viewBox="0 0 200 200" color={colours[index]}>
                  <path
                    fill="currentColor"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                  />
                </Icon>
              </Td>
              <Td>
                <h2>{emotion.emotion}</h2>
              </Td>
            </React.Fragment>
          })}
        </Tbody>
      </Table>
      </Center>
      {/* </SimpleGrid> */}

    </Box>
  );
};

export default Pie;
