import type { BlitzLayout } from "blitz";

import { Fragment } from "react";

import { useColorModeValue } from "@chakra-ui/react";
import { Flex, Box, Heading, Text } from "@chakra-ui/layout";

import Seo from "../components/seo";

type BoxLayoutProps = {
  title: string;
  description: string;
};

const BoxLayout: BlitzLayout<BoxLayoutProps> = ({
  title,
  description,
  children,
}) => {
  const background = useColorModeValue("gray.100", "gray.900");
  const boxBackground = useColorModeValue("white", "gray.700");

  return (
    <Fragment>
      <Seo title={title} description={description} />

      <Flex
        w="100%"
        minH="100%"
        align="center"
        justify="center"
        direction="column"
        bg={background}
      >
        <Box
          as="main"
          w={{ base: "100%", md: "500px" }}
          minH={{ base: "100vh", md: "auto" }}
          my={{ base: "0", md: 4 }}
          p={10}
          maxW="100%"
          position="relative"
          bg={boxBackground}
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
    </Fragment>
  );
};

export default BoxLayout;
