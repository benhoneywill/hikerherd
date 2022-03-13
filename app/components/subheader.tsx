import type { FC } from "react";

import { Box, Container } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

const Subheader: FC = ({ children }) => {
  return (
    <Box
      py={2}
      borderBottom="1px solid"
      borderBottomColor={useColorModeValue("gray.200", "gray.800")}
      bg={useColorModeValue("white", "gray.700")}
      zIndex={2}
    >
      <Container maxW="100%">{children}</Container>
    </Box>
  );
};

export default Subheader;
