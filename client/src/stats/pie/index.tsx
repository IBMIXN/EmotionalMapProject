import { Box, Icon, Heading, useTheme, Table, Tbody, Td, Center, Skeleton, } from "@chakra-ui/react";
import * as React from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Emotions, getBreakdownData } from "../../services/api";

export const Pie = (): JSX.Element => {
  const theme = useTheme();
  const colours = [theme.colors.green[400], theme.colors.orange[400], theme.colors.red[400], theme.colors.blue[400]];

  const [breakdown, setBreakdown] = React.useState<Emotions | undefined>(undefined);
  React.useEffect(() => {
    getBreakdownData().then((data) => {
      setBreakdown(data)
    })
  }, [setBreakdown])

  const chart = () => {
    if (breakdown) {
      return <React.Fragment>
        <Box mt={6} alignContent="right">
          <PieChart
            style={{
              height: "250px",
              fontFamily:
                '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
              fontSize: "0.3em",
            }}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fill: "#fff",
              opacity: 1,
              pointerEvents: "none",
            }}
            data={[
              { value: breakdown.joy, color: colours[0] },
              { value: breakdown.fear, color: colours[1] },
              { value: breakdown.anger, color: colours[2] },
              { value: breakdown.sadness, color: colours[3] },
            ]}
          />      </Box>

        <Center><Table mt={3} width="80%" variant="unstyled">
          <Tbody>
            {["Happy", "Concerned", "Impassioned", "Pensive"].map((emotion, index) => {
              return <React.Fragment key={emotion}>
                <Td width="10px" style={{ padding: 0 }}>
                  <Icon viewBox="0 0 200 200" color={colours[index]}>
                    <path
                      fill="currentColor"
                      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                    />
                  </Icon>
                </Td>
                <Td>
                  <h2>{emotion}</h2>
                </Td>
              </React.Fragment>
            })}
          </Tbody>
        </Table>
        </Center>
      </React.Fragment>

    } else {
      return <Skeleton mt={8} height="250px" />
    }
  }

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

      {chart()}
    </Box>
  );
};

export default Pie;
