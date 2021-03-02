import { Box, Center, Heading, Spinner, Text, useColorModeValue, useTheme } from "@chakra-ui/react";
import { scaleLinear } from "d3-scale";
import * as React from "react";
import { useSelector } from "react-redux";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Emotion, View } from "../slices/selectedMap";
import { RootState } from "../store";
import britain from "./Ceremonial_counties.json";
import northernireland from "./OSNI_Open_Data_-_50K_Boundaries_-_NI_Counties.json";
import ReactTooltip from "react-tooltip";
import { EmotionData, getEmotionData } from "../services/api"


interface MapProps {
  onClickAction: boolean
}

export const Map = (props: MapProps): JSX.Element => {
  const { view, emotion } = useSelector(
    (state: RootState) => state.selectedMap
  );

  const [emotionData, setEmotionData] = React.useState<EmotionData | undefined>(undefined);
  React.useEffect(() => {
    getEmotionData().then((data) => {
      setEmotionData(data)
    })
  }, [setEmotionData])

  const [tooltipContent, setTooltipContent] = React.useState("");
  const [selectedCounty, setSelectedCounty] = React.useState("");

  const bg = useColorModeValue("white", "gray.700");

  const theme = useTheme();

  const colour: string = ((): string => {
    switch (emotion) {
      case Emotion.FEAR:
        return theme.colors.orange[700];
      case Emotion.ANGER:
        return theme.colors.red[700];
      case Emotion.SADNESS:
        return theme.colors.blue[700];
      default:
        return theme.colors.green[700];
    }
  })();

  const colourScale = scaleLinear<string>().domain([-0.2, 1]).range(["white", colour]);

  let selectionHeader = () => {
    if (view === View.STRONGEST)
    {
      return <Text>Strongest emotion for each settlement</Text>
    } else {
      switch (emotion) {
        case Emotion.FEAR:
          return <Text>Fear levels for each settlement</Text>
        case Emotion.ANGER:
          return <Text>Anger levels for each settlement</Text>
        case Emotion.SADNESS:
          return <Text>Sadness levels for each settlement</Text>
        default:
          return <Text>Joy levels for each settlement</Text>
      }
    } 
  }


  if (emotionData !== undefined) {
    console.log(emotionData);
    return (
      <Box h="100%">
        <div style={{ height: "100%", width: "100%" }}>
          {(props.onClickAction && !selectedCounty) && <Text style={{ width: "400px", right: "10px", top: "10px", position: "absolute" }}>
            Click on a county to view a breakdown of settlements
      </Text>}
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          {selectedCounty && <Box boxShadow="lg" p="6" rounded="md" bg={bg} style={{ width: "400px", right: "10px", top: "10px", position: "absolute" }}>
            <Heading mb="2" size="md">{selectedCounty}</Heading>
            <Box mb="1">{selectionHeader()}
            </Box>
            {emotionData.counties[selectedCounty] && <React.Fragment>
              {Object.keys(emotionData.counties[selectedCounty].settlements).map((name) => {
                let emotions = emotionData.counties[selectedCounty].settlements[name];
                if (view === View.STRONGEST) {
                  const maxKey = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                  switch (maxKey) {
                    case Emotion.FEAR:
                      return <Text><strong>{name}</strong>: Fear</Text>
                    case Emotion.ANGER:
                      return <Text><strong>{name}</strong>: Anger</Text>
                    case Emotion.SADNESS:
                      return <Text><strong>{name}</strong>: Sadness</Text>
                    default:
                      return <Text><strong>{name}</strong>: Joy</Text>
                  }
                } else {
                  switch (emotion) {
                    case Emotion.FEAR:
                      return <Text><strong>{name}</strong>: {(emotions.fear * 100).toFixed(0)}%</Text>
                    case Emotion.ANGER:
                      return <Text><strong>{name}</strong>: {(emotions.anger * 100).toFixed(0)}%</Text>
                    case Emotion.SADNESS:
                      return <Text><strong>{name}</strong>: {(emotions.sadness * 100).toFixed(0)}%</Text>
                    default:
                      return <Text><strong>{name}</strong>: {(emotions.joy * 100).toFixed(0)}%</Text>
                  }
                }
              })
              }
            </React.Fragment>}
          </Box>
          }
          <ComposableMap data-tip=""
            style={{ height: "100%", width: "100%" }}
            projection="geoAlbers"
            projectionConfig={{
              center: [1.5, 55.2],
              rotate: [4.4, 0, 0],
              parallels: [50, 50],
              scale: 3300,
            }}
          >
            <ZoomableGroup>

              {/* https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json */}

              {[britain, northernireland].map((g, index) => {
                return (
                  <Geographies key={index} geography={g}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name = geo.properties.NAME || geo.properties.CountyName;
                        const emotions = emotionData.counties[name]?.emotions;
                        let colour = "#FFFFFF";
                        if (emotions) {
                          const maxKey = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                          console.log(maxKey);
                          if (view === View.STRONGEST) {
                            switch (maxKey) {
                              case Emotion.FEAR:
                                colour = theme.colors.orange[700];
                                break;
                              case Emotion.ANGER:
                                colour = theme.colors.red[700];
                                break;
                              case Emotion.SADNESS:
                                colour = theme.colors.blue[700];
                                break;
                              default:
                                colour = theme.colors.green[700];
                                break;
                            }
                          } else {
                            switch (emotion) {
                              case Emotion.FEAR:
                                colour = colourScale(emotions.fear);
                                break;
                              case Emotion.ANGER:
                                colour = colourScale(emotions.anger);
                                break;
                              case Emotion.SADNESS:
                                colour = colourScale(emotions.sadness);
                                break;
                              default:
                                colour = colourScale(emotions.joy);
                                break;
                            }
                          }

                        }

                        return (
                          <Geography
                            style={{
                              default: {
                                outline: 'none'
                              },
                              hover: {
                                outline: 'none'
                              },
                              pressed: {
                                outline: 'none'
                              }
                            }}
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                              setTooltipContent(name);
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("");
                            }}
                            onClick={() => {
                              if (props.onClickAction)
                                setSelectedCounty(name);
                            }}
                            stroke="#aaaaaa"
                            fill={colour}
                          />

                        );
                      })
                    }
                  </Geographies>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

      </Box >
    );
  }
  else {
    return <Box h="100%">
      <Center h="100%">  <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="black"
        size="xl"
      /></Center>

    </Box>;
  }
};


export default Map;