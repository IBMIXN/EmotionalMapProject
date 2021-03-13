import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import * as React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import MapControls from "./mapcontrols";
import StatControls from "./statcontrols";
import dateFormat from "dateformat";

export const Sidebar = (): JSX.Element => {
  const { push } = useHistory();
  const location = useLocation();
  const stats: boolean = location.pathname === "/stats";
  const bg = useColorModeValue("white", "gray.700");

  return (
    <Flex p={8} bg={bg} height="100%" direction="column">
      <HStack spacing={4}>
        <Heading>Emotion Map</Heading>
        <ColorModeSwitcher />
      </HStack>
      <Text fontSize="xl">{dateFormat(Date(), "dddd d mmmm yyyy")}</Text>
      <Divider mt={2} />
      <Switch>
        <Route exact path="/" component={MapControls} />
        <Route path="/stats" component={StatControls} />
      </Switch>
      <Spacer />
      <Divider mb={2} />
      <Button
        flexShrink={0}
        colorScheme={stats ? "brand" : "gray"}
        size="lg"
        onClick={() => push(stats ? "/" : "/stats")}
      >
        {stats ? "Back to Map" : "View Statistics"}
      </Button>
    </Flex>
  );
};

export default Sidebar;
