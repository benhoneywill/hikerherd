import type { FC } from "react";

import { Box, Container } from "@chakra-ui/layout";

const Subheader: FC = ({ children }) => {
  return (
    <Box borderBottom="1px solid" py={2} borderColor="gray.200" bg="gray.50">
      <Container maxW="100%">{children}</Container>
    </Box>
  );
};

export default Subheader;
