import type { FC } from "react";

import { Stack, Text } from "@chakra-ui/react";

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
  return (
    <Stack spacing={3}>
      {isLoading && <Text>Searching...</Text>}

      {!query && <Text>{message}</Text>}

      {items?.length === 0 && (
        <Text>No results found for &quot;{query}&quot;.</Text>
      )}

      {!isLoading && items?.length > 0 && children}
    </Stack>
  );
};

export default SearchResults;
