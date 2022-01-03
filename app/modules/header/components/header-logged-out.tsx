import type { FC } from "react";

import { Link, Routes } from "blitz";

import { HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { FaArrowRight } from "react-icons/fa";

const HeaderLoggedOut: FC = () => {
  return (
    <HStack spacing={1} justify="flex-end">
      <Link href={Routes.LoginPage()} passHref>
        <Button size="sm" as="a" variant="ghost">
          Log in
        </Button>
      </Link>
      <Link href={Routes.SignupPage()} passHref>
        <Button
          size="sm"
          as="a"
          rightIcon={<FaArrowRight />}
          colorScheme="blue"
        >
          Sign up
        </Button>
      </Link>
    </HStack>
  );
};

export default HeaderLoggedOut;
