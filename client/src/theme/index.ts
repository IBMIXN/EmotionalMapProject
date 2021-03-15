// https://chakra-ui.com/docs/theming/customize-theme
import { extendTheme } from "@chakra-ui/react"

const overrides = {
  config: {
    useSystemColorMode: true,
  },
  colors: {
    // brand: {
    //   50: "#E8EAF6",
    //   100: "#C5CAE9",
    //   200: "#9FA8DA",
    //   300: "#7986CB",
    //   400: "#5C6BC0",
    //   500: "#3F51B5",
    //   600: "#3949AB",
    //   700: "#303F9F",
    //   800: "#283593",
    //   900: "#1A237E",
    // },
    brand: {
      50: "#eaebff",
      100: "#c9ccff",
      200: "#a4abff",
      300: "#7a89ff",
      400: "#576cff",
      500: "#304ffe",
      600: "#2b46f2",
      700: "#1e3ae5",
      800: "#0d2cda",
      900: "#0009ca",
    },
  }
}


export default extendTheme(overrides)