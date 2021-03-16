import * as React from "react";
import { Box, Flex, useBreakpointValue, Container, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "./sidebar";
import Map from "./map";
import { Route, Switch } from "react-router-dom";
import Stats from "./stats";


export const App = (): JSX.Element => {
  const showSidebar = useBreakpointValue({ base: false, md: true }) ?? true;
  const bg = useColorModeValue("white", "gray.900");

  if (showSidebar) {
    return <Flex h="100vh" >
      <Box w="360px" h="100%" style={{ position: 'fixed' }} boxShadow="xl">
        <Sidebar />
      </Box>
      <Box flex="1" h="100%" ml="360px">
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
    return <Container backgroundColor={bg}>
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <Box h="600px">
          <Map onClickEnabled={true} />
          </Box>
        </Route>
        <Route path="/stats">
          <Stats />
        </Route>
      </Switch>
    </Container>
  }

};
