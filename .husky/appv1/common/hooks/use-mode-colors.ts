import { useColorModeValue } from "@chakra-ui/react";

const useThemedColorScale = (color: string) => {
  return {
    50: useColorModeValue(`${color}.50`, `${color}.900`),
    100: useColorModeValue(`${color}.100`, `${color}.800`),
    200: useColorModeValue(`${color}.200`, `${color}.700`),
    300: useColorModeValue(`${color}.300`, `${color}.600`),
    400: useColorModeValue(`${color}.400`, `${color}.500`),
    500: useColorModeValue(`${color}.500`, `${color}.400`),
    600: useColorModeValue(`${color}.600`, `${color}.300`),
    700: useColorModeValue(`${color}.700`, `${color}.200`),
    800: useColorModeValue(`${color}.800`, `${color}.100`),
    900: useColorModeValue(`${color}.300`, `${color}.50`),
  };
};
const useModeColors = () => {
  return {
    header: {
      bg: useColorModeValue("gray.50", "gray.700"),
      border: useColorModeValue("gray.200", "gray.600"),
    },

    gray: useThemedColorScale("gray"),
    blue: useThemedColorScale("blue"),
  };
};

export default useModeColors;
