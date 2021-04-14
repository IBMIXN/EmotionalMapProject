import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Popup } from "./Popup";
import store from "./store";
import theme from "./theme";
import GitHubForkRibbon from 'react-github-fork-ribbon';


ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
          <Popup />
          <GitHubForkRibbon href="https://github.com/IBMIXN/EmotionalMapProject"
            target="_blank"
            position="right-bottom"
            color="black">
            Fork me on GitHub
          </GitHubForkRibbon>
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
