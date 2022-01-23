import type { ChangeEventHandler, FC } from "react";

import { useCallback, useEffect, useMemo } from "react";

import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
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
        <Icon as={FaSearch} />
      </InputLeftElement>
      <Input
        onChange={debouncedChangeHandler}
        placeholder="Search..."
        {...props}
      />
    </InputGroup>
  );
};

export default SearchInput;
