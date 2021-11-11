import type { FC } from "react";

import { Divider, Stack, Text } from "@chakra-ui/layout";

export const TextDivider: FC = ({ children }) => (
  <Stack direction="row" align="center">
    <Divider />
    <Text fontSize="small" color="gray.500" textTransform="uppercase" fontWeight="semibold">
      {children}
    </Text>
    <Divider />
  </Stack>
);
