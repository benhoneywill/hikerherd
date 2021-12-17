import type { FC } from "react";

import { Link, Routes } from "blitz";

import { Box } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

const HeaderLogo: FC = () => {
  return (
    <Link href={Routes.HomePage()} passHref>
      <Box
        as="a"
        display="block"
        bgImage={`/images/logo-${useColorModeValue("dark", "light")}.svg`}
        bgSize="auto 100%"
        height={{ base: 8, md: 6 }}
        width={{ base: 8, md: "121px" }}
      />
    </Link>
  );
};

export default HeaderLogo;
