import * as React from "react"
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  Tooltip,
} from "@chakra-ui/react"
import { FaMoon, FaPalette, FaPallet, FaSun } from "react-icons/fa"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher = (props: ColorModeSwitcherProps): JSX.Element => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  // const SwitchIcon = useColorModeValue(FaParlette, FaPalette)

  return (
    <Tooltip label="Change the website theme" placement="right">
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<FaPalette/>}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  </Tooltip>
    
  )
}
