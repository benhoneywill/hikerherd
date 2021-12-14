import { useColorModeValue } from "@chakra-ui/react";

const useColorModeValues = () => {
  return {
    body: useColorModeValue("gray.100", "gray.800"),
    card: useColorModeValue("white", "gray.700"),
  };
};

export default useColorModeValues;
