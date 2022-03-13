import type { ChangeEventHandler, FC } from "react";

import { useCallback, useEffect, useMemo } from "react";

import { Icon } from "@chakra-ui/icon";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash/debounce";

type SearchInputProps = {
  setQuery: (val: string) => void;
};

const SearchInput: FC<SearchInputProps> = ({ setQuery, ...props }) => {
  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      setQuery(target.value);
    },
    [setQuery]
  );

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    [changeHandler]
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color="gray.500" />
      </InputLeftElement>
      <Input
        onChange={debouncedChangeHandler}
        placeholder="Search..."
        variant="filled"
        {...props}
      />
    </InputGroup>
  );
};

export default SearchInput;
