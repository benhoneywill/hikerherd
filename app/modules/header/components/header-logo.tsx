import type { FC } from "react";

import { Link, Routes } from "blitz";

import { HStack, Heading } from "@chakra-ui/react";

import LogoIcon from "app/modules/common/icons/logo";

const HeaderLogo: FC = () => {
  return (
    <Link href={Routes.HomePage()} passHref>
      <HStack as="a">
        <LogoIcon w={5} h={5} />
        <Heading size="md" display={{ base: "none", md: "block" }}>
          hikerherd
        </Heading>
      </HStack>
    </Link>
  );
};

export default HeaderLogo;
