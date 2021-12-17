import type { FC } from "react";

import { Divider, HStack, Text } from "@chakra-ui/layout";

const TextDivider: FC = ({ children }) => (
  <HStack align="center">
    <Divider />
    <Text
      fontSize="small"
      color="gray.500"
      textTransform="uppercase"
      fontWeight="semibold"
    >
      {children}
    </Text>
    <Divider />
  </HStack>
);

export default TextDivider;
