import type { ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/theme-tools";

import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  useSystemColorMode: true,
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode("gray.100", "gray.800")(props),
    },
  }),
};

const theme = extendTheme({
  config,
  styles,
});

export default theme;
