import type { ChangeEventHandler, FC } from "react";

import { useCallback, useEffect, useMemo } from "react";

import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash/debounce";

import useModeColors from "../hooks/use-mode-colors";

type SearchInputProps = {
  setQuery: (val: string) => void;
};

const SearchInput: FC<SearchInputProps> = ({ setQuery }) => {
  const { gray } = useModeColors();

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
        <Icon as={FaSearch} color={gray[400]} />
      </InputLeftElement>
      <Input onChange={debouncedChangeHandler} placeholder="Search..." />
    </InputGroup>
  );
};

export default SearchInput;
