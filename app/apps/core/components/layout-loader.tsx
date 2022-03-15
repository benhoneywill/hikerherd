import type { FC } from "react";

import { Fragment } from "react";

import { Skeleton } from "@chakra-ui/skeleton";

import Header from "app/components/header/components/header";

const LayoutLoader: FC = () => {
  return (
    <Fragment>
      <Header />
      <Skeleton
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
      />
    </Fragment>
  );
};

export default LayoutLoader;
