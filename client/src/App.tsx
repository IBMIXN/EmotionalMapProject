import * as React from "react";
import { Box, Flex, useBreakpointValue, Container } from "@chakra-ui/react";
import Sidebar from "./sidebar";
import Map from "./map";
import { Route, Switch } from "react-router-dom";
import Stats from "./stats";


export const App = (): JSX.Element => {
  const showSidebar = useBreakpointValue({ base: false, md: true }) ?? true;

  if (showSidebar) {
    return <Flex h="100vh">
      <Box w="350px" h="100%" style={{ position: 'fixed' }} boxShadow="xl">
        <Sidebar />
      </Box>
      <Box flex="1" h="100%" p={4} ml="350px">
        <Switch>
          <Route exact path="/">
            <Map onClickEnabled={true} />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
        </Switch>
      </Box>
    </Flex>
  } else {
    return <Container>
      <Sidebar />

      <Switch>
        <Route exact path="/">
          <Map onClickEnabled={true} />
        </Route>
        <Route path="/stats">
          <Stats />
        </Route>
      </Switch>
    </Container>
  }

};
