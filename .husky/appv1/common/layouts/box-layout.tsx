import type { BlitzLayout } from "blitz";

import { useColorModeValue } from "@chakra-ui/react";
import { Flex, Box, Heading, Text } from "@chakra-ui/layout";

import Seo from "./seo";

const BoxLayout: BlitzLayout<{ title: string; description: string }> = ({
  title,
  description,
  children,
}) => {
  return (
    <>
      <Seo title={title} description={description} />

      <Flex
        w="100vw"
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        bg={useColorModeValue("gray.100", "gray.900")}
      >
        <Box
          as="main"
          w={{ base: "100%", md: "500px" }}
          minH={{ base: "100vh", md: "auto" }}
          my={{ base: "0", md: 4 }}
          p={10}
          maxW="100%"
          position="relative"
          bg={useColorModeValue("white", "gray.700")}
          borderRadius={{ base: 0, md: "xl" }}
          textAlign="center"
        >
          <Box as="header" mb={8}>
            <Heading mb={3}>{title}</Heading>
            <Text fontSize="lg" color="gray.400">
              {description}
            </Text>
          </Box>

          {children}
        </Box>
      </Flex>
    </>
  );
};

export default BoxLayout;
