import type { FC } from "react";
import type { StackProps } from "@chakra-ui/layout";

import { Divider, HStack, Text } from "@chakra-ui/layout";

const TextDivider: FC<StackProps> = ({ children, ...props }) => (
  <HStack align="center" {...props}>
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
