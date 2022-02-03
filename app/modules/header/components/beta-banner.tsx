import type { FC } from "react";

import { useEffect, useState } from "react";

import { Box, Text, Link, Container, HStack } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

const BetaBanner: FC = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const isHidden = window.sessionStorage.getItem("betaBannerHidden");
    setHidden(!!isHidden);
  }, []);

  const hide = () => {
    setHidden(true);
    window.sessionStorage.setItem("betaBannerHidden", "true");
  };

  if (hidden) return null;

  return (
    <Box
      bg="blue.400"
      p={1}
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor="blue.500"
    >
      <Container maxW="100%">
        <HStack justify="space-between">
          <Text color="white">
            hikerherd is in <strong>beta</strong>. Your{" "}
            <Link
              textDecoration="underline"
              isExternal
              href="https://docs.google.com/forms/d/e/1FAIpQLSd488niomGdU4Cd96hLGTakK5isfE5Ajzy4HTMOjchQ6ZdFcQ/viewform"
            >
              feedback
            </Link>{" "}
            will help improve it!
          </Text>

          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Close banner"
            color="blue.50"
            _hover={{ bg: "blue.500" }}
            icon={<FaTimes />}
            onClick={hide}
          />
        </HStack>
      </Container>
    </Box>
  );
};

export default BetaBanner;
