import { Box, Center, Heading, Spinner, Text, useBreakpointValue, useColorModeValue, useTheme } from "@chakra-ui/react";
import { scaleLinear } from "d3-scale";
import * as React from "react";
import { useSelector } from "react-redux";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Emotion, View } from "../slices/selectedMap";
import { RootState } from "../store";
import britain from "./britishcountiestopojson.json";
import northernireland from "./northernirelandtopojson.json";
import ReactTooltip from "react-tooltip";
import { Counties, County, getCountiesData } from "../services/api"



interface InformationBoxProps {
  selectedCounty: County,
  view: View,
  emotion: Emotion
}
const InformationBox = (props: InformationBoxProps): JSX.Element => {
  const bg = useColorModeValue("white", "gray.800");
  const mobileMode = useBreakpointValue({ base: true, md: false }) ?? false;


  const selectionHeader = () => {
    if (props.view === View.STRONGEST) {
      return <Text>Strongest emotion for each settlement</Text>
    } else {
      switch (props.emotion) {
        case Emotion.FEAR:
          return <Text>Fear levels for each settlement (overall: {(props.selectedCounty.emotions.fear * 100).toFixed(0)}%)</Text>
        case Emotion.ANGER:
          return <Text>Anger levels for each settlement (overall: {(props.selectedCounty.emotions.anger * 100).toFixed(0)}%)</Text>
        case Emotion.SADNESS:
          return <Text>Sadness levels for each settlement (overall: {(props.selectedCounty.emotions.sadness * 100).toFixed(0)}%)</Text>
        default:
          return <Text>Joy levels for each settlement (overall: {(props.selectedCounty.emotions.joy * 100).toFixed(0)}%)</Text>
      }
    }
  }
  return <Box boxShadow="lg" p="6" rounded="md" bg={bg} style={mobileMode ? {
    bottom: "10px", right: "10px", left: "10px", position: "absolute"
  } : { width: "400px", right: "10px", top: "10px", position: "absolute" }}>
    <Heading mb="2" size="md">{props.selectedCounty.name}</Heading>
    <Box mb="1">{selectionHeader()}
    </Box>
    {
      props.selectedCounty.settlements.map((settlement) => {
        const title = `${settlement.name}`
        if (props.view === View.STRONGEST) {
          const maxKey = Object.entries(settlement.emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
          switch (maxKey) {
            case Emotion.FEAR:
              return <Text><strong>{title}</strong>: Fear</Text>
            case Emotion.ANGER:
              return <Text><strong>{title}</strong>: Anger</Text>
            case Emotion.SADNESS:
              return <Text><strong>{title}</strong>: Sadness</Text>
            default:
              return <Text><strong>{title}</strong>: Joy</Text>
          }
        } else {
          switch (props.emotion) {
            case Emotion.FEAR:
              return <Text><strong>{title}</strong>: {(settlement.emotions.fear * 100).toFixed(0)}%</Text>
            case Emotion.ANGER:
              return <Text><strong>{title}</strong>: {(settlement.emotions.anger * 100).toFixed(0)}%</Text>
            case Emotion.SADNESS:
              return <Text><strong>{title}</strong>: {(settlement.emotions.sadness * 100).toFixed(0)}%</Text>
            default:
              return <Text><strong>{title}</strong>: {(settlement.emotions.joy * 100).toFixed(0)}%</Text>
          }
        }
      })
    }
  </Box >
}

interface MapProps {
  onClickEnabled: boolean
}

export const Map = (props: MapProps): JSX.Element => {
  const { view, emotion } = useSelector(
    (state: RootState) => state.selectedMap
  );

  const mobileMode = useBreakpointValue({ base: true, md: false }) ?? false;

  const [emotionData, setEmotionData] = React.useState<Counties | undefined>(undefined);
  React.useEffect(() => {
    getCountiesData().then((data) => {
      setEmotionData(data)
    })
  }, [setEmotionData])

  const [tooltipContent, setTooltipContent] = React.useState("");
  const [selectedCountyName, setSelectedCountyName] = React.useState("");


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

  const colourScale = scaleLinear<string>().domain([0, 0.5]).range(["white", colour]);

  const map = (emotionData: Counties) => [britain, northernireland].map((g, index) => {
    return (
      <Geographies key={index} geography={g}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const name = geo.properties.NAME || geo.properties.CountyName;
            const county = emotionData[name]
            let colour = "#FFFFFF";
            if (county) {
              const maxKey = Object.entries(county.emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
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
                    colour = colourScale(county.emotions.fear);
                    break;
                  case Emotion.ANGER:
                    colour = colourScale(county.emotions.anger);
                    break;
                  case Emotion.SADNESS:
                    colour = colourScale(county.emotions.sadness);
                    break;
                  default:
                    colour = colourScale(county.emotions.joy);
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
                  if (props.onClickEnabled)
                    setSelectedCountyName(name);
                }}
                stroke="#aaaaaa"
                fill={colour}
              />

            );
          })
        }
      </Geographies>
    );
  });

  if (emotionData !== undefined) {
    const selectedCounty = emotionData[selectedCountyName]
    return (
      <Box h="100%">
        <div style={{ height: "100%", width: "100%" }}>
          {(props.onClickEnabled && !selectedCounty) && <Text style={mobileMode ? { width: "100%", bottom: "10px", position: "absolute" } : { width: "400px", right: "10px", top: "10px", position: "absolute" }}>
            Click on a county to view a breakdown of settlements
      </Text>}
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          {selectedCounty && <InformationBox selectedCounty={selectedCounty} view={view} emotion={emotion} />}

          <ComposableMap data-tip=""
            style={{ height: "100%", width: "100%" }}
            projection="geoAlbers"
            projectionConfig={{
              center: [1.5, 55.2],
              rotate: [4.4, 0, 0],
              parallels: [50, 50],
              scale: 3000,
            }}
          >
            {mobileMode ? map(emotionData) : <ZoomableGroup>
              {map(emotionData)}
            </ZoomableGroup>}

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