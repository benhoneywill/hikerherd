import type { FC } from "react";

import { useColorModeValue } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { Center, Box, Text } from "@chakra-ui/layout";

type SearchResultsProps = {
  query: string;
  message: string;
  isLoading: boolean;
  items: any[];
};

const SearchResults: FC<SearchResultsProps> = ({
  children,
  query,
  isLoading,
  message,
  items,
}) => {
  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box>
      {isLoading && (
        <Center p={3}>
          <Spinner />
        </Center>
      )}

      {!query && !items.length && !isLoading && (
        <Text pl={3} fontSize="lg" color={textColor}>
          {message}
        </Text>
      )}

      {query && !isLoading && items?.length === 0 && (
        <Text pl={3} fontSize="lg" color={textColor}>
          No results found for &quot;{query}&quot;.
        </Text>
      )}

      {!isLoading && items?.length > 0 && children}
    </Box>
  );
};

export default SearchResults;
