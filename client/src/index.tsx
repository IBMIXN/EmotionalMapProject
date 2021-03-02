import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import store from "./store";
import theme from "./theme";


ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <Provider store={store}>
      <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
